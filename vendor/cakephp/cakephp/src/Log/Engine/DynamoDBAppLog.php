<?php
namespace Cake\Log\Engine;

use Aws\DynamoDb\DynamoDbClient;
use Aws\DynamoDb\Marshaler;
use Cake\Controller\ComponentRegistry;
use Cake\Datasource\ConnectionManager;
use Cake\I18n\FrozenTime;
use Cake\Network\Request;
use Cake\ORM\TableRegistry;

/**
 * Class DynamoDBAppLog
 * @package Cake\Log\Engine
 */
class DynamoDBAppLog extends BaseLog
{
    /**
     * @param mixed $level
     * @param string $message
     * @param array $context
     * @return null|void
     */
    public function log($level, $message, array $context = [])
    {
        try {
            $this->_log($level, $message, $context);
        } catch (\Exception $exception) {
            // 無限ループ回避
        }
    }

    private function _log($level, $message, $context)
    {
        /** @var \App\Utils\Enum $enum */
        $enum = enums();

        // メッセージが mySQL の text 型の最大長を超える場合、複数回に分けてDB登録
        // 最大長は 65535 ですが、余裕を見て 50000 ずつ切り分けるようにしています。
        $maxRepeatCount = 3;
        if (50000 * $maxRepeatCount < strlen($message)) {
            // あまりに長いメッセージは最後を切る。（エラーで落ちてしまうため）
            $message = substr($message, 0, 50000 * $maxRepeatCount);
        }
        if (50000 < strlen($message)) {
            for ($i = 1; 50000 < strlen($message); $i++) {
                $this->log($level, substr($message, 50000 * ($i-1), 50000), $context);
                $message = substr($message, 50000 * $i);
            }
        }

        $mt = microtime(true);
        $mt = strval($mt);
        $array = explode('.', $mt);
        $sec = $array[0];
        $sec = intval($sec);
        $sec += (new FrozenTime())->getOffset();
        if (empty($array[1])) {
            $milliSec = '000';
        } else {
            $milliSec = substr(($array[1]. '000'), 0, 3);
        }
        $operationDatetime = (new FrozenTime($sec))->format('Y-m-d H:i:s'). '.'. $milliSec;
        $uniqueId = uniqid('', true);

        $request = new Request();

        // Cookie Component の読み込み
        $comp = new ComponentRegistry();
        /** @var \Cake\Controller\Component\CookieComponent $cookieObj */
        $cookieObj = $comp->load("Cookie", ["className" => "Cake\Controller\Component\CookieComponent"]);

        // メッセージ
        // $message = \App\Utils\SACommon::utf8mb4_encode_numericentity($message);
        // $message = $this->_format($message);
		$message = '';

        // ロードバランサー環境で、ローカルのIPを正しく取得する為の設定。
        $request->trustProxy = true;

        $data = [
            'device_key' => '',
            'app_user_id' => '0',
            'user_name' => '',
            'head_company_id' => 0,
            'company_id' => 0,
            'store_id' => 0,
            'store_key' => '0-0-0',
            'app_name' => '',
            'store_short_name' => '',

            'ec2_instance_name' => EC2_INSTANCE_NAME,
            'operation_datetime_key' => $operationDatetime. ' '. $uniqueId,
            'log_level' => $level,
            'is_cookie' => $cookieObj->read(COOKIE_USER_CAN_USE_COOKIE) ? 1 : 0,
            'user_agent' => $request->env('HTTP_USER_AGENT'),
            'ip_address' => $request->clientIp(),
            'url' => '',
            'url_short' => '',
            'message' => $message,
            'message_short' => $this->_formatShortMessage($message),
            'ios_appli_no' => $cookieObj->read(COOKIE_IOS_APPLI_NO) ?: '',
            'ios_appli_version' => $cookieObj->read(COOKIE_IOS_APPLI_VERSION) ?: '',
            'ttl' => FrozenTime::now()->addMonth(2)->getTimestamp(),  // DynamoDB の TTL (Time To Live) 機能用、2か月経過したものは自動的に消える。AWS Backup で月に一度バックアップが取られ、それは 15ヶ月保持される。
        ];

        if ($data['is_cookie']) {
            $logBaseData = $this->getLogBaseData($cookieObj, $context);
            foreach ($logBaseData as $key => $value) {
                $data[$key] = $value;
            }
        }

        if (isset($_SERVER) && !empty($_SERVER['REQUEST_URI'])) {
            $data['url'] = $_SERVER['REQUEST_URI'];
            $data['url_short'] = $this->_formatUrlShort($data['url']);
        }

        if ( strpos($message, '[SmartyException]') !== false ) {
            $data['log_level'] = $enum->LogLevel->ERROR_SMARTY->text;
        }

        // 保存
        try {
            $settings = [
                'version' => DYNAMO_DB_VERSION,
                'region'  => DYNAMO_DB_REGION,
                'credentials' => [
                    'key'    => DYNAMO_DB_CREDENTIALS_KEY,
                    'secret' => DYNAMO_DB_CREDENTIALS_SECRET,
                ],
            ];
            if ( SYSTEM_ENVIRONMENT_NAME === 'local' ) {
                $settings['endpoint'] = 'http://localhost:8000';
            }
            $dynamoDbClient = new DynamoDbClient($settings);
            $marshaler = new Marshaler(['nullify_invalid' => true]);

            $tableName = DYNAMO_DB_TABLE_NAME_APP_LOGS;

            $dynamoDbClient->putItem([
                'TableName' => $tableName,
                'Item' => $marshaler->marshalItem($data),
            ]);
        } catch (\Exception $exception) {
            $data['operation_date'] = (new FrozenTime($sec))->format('Y-m-d H:i:s');
            $data['level'] = strtoupper($data['log_level']);

            /** @var \App\Model\Table\AppLogOperationsTable $appLogOperations */
            // OperationLogs : app.config で設定してあるもの
            $appLogOperations = TableRegistry::get('AppLogOperations');
            $conn = ConnectionManager::get('log');
            $appLogOperations->connection($conn);

            /** @var \App\Model\Entity\AppLogOperation $appLogOperation */
            $appLogOperation = $appLogOperations->newEntity($data);

            $appLogOperations->save($appLogOperation);

            $message = $exception->getMessage();
            $message .= "\r\n". $exception->getFile(). '('. $exception->getLine(). ')';
            $message .= "\r\n\r\n". $exception->getTraceAsString();

            $data['message'] = $message;
            $data['level'] = $enum->LogLevel->ERROR->text;

            $appLogOperation = $appLogOperations->newEntity($data);
            $appLogOperations->save($appLogOperation);
        }

        // 本番環境でのエラーは ChatWork に通知
        if (
            SYSTEM_ENVIRONMENT_NAME === 'master'
            && $level == enums()->LogLevel->ERROR->value
            && !empty(ERROR_LOG_CHAT_WORK_ROOM_ID)
            && !empty(ERROR_LOG_CHAT_API_TOKEN)
        )
        {
            if ( strpos($message, '以下の店舗システム設定が未設定です') === false
                && strpos($message, '以下の企業システム設定が未設定です') === false
                && strpos($message, '所属、参照可能企業・店舗を確認してください。') === false
                && strpos($message, 'この予約は削除されました。') === false
                && strpos($message, 'SmartyException]') === false
                && strpos($message, 'MissingRouteException]') === false
                && strpos($message, '\\NotFoundException]') === false
                && strpos($message, 'AuthorityException]') === false
                && strpos($message, 'MissingTemplateException]') === false
                && strpos($message, 'receive-cti-register-js') === false
                && strpos($message, '[Cake\\Routing\\Exception\\MissingControllerException] Controller class Reserve could not be found.') === false
                && strpos($message, 'TypeError: DayPilot.Scheduler is not a constructor') === false
                && strpos($message, 'Request URL: /sas/js/push/favicon.ico') === false
                && strpos($message, 'Request URL:/sas/js/canvas-to-blob.min.js.map') === false
                && strpos($message, 'ReferenceError: Vue is not defined') === false
                && strpos($message, 'ReferenceError: DayPilot is not defined') === false

                && preg_match('/\[Cake\\\\Routing\\\\Exception\\\\MissingControllerException\] Controller class .+:[0-9]+ could not be found/s', $message) !== 1
                && preg_match('/\[Cake\\\\Controller\\\\Exception\\\\MissingActionException\] Action [a-zA-Z]+Controller::css\(\) could not be found/s', $message) !== 1
                && preg_match('/\[Cake\\\\Controller\\\\Exception\\\\MissingActionException\] Action [a-zA-Z]+Controller::js\(\) could not be found/s', $message) !== 1
                && preg_match('/\[Cake\\\\Controller\\\\Exception\\\\MissingActionException\] Action [a-zA-Z]+Controller::favicon\.ico\(\) could not be found/s', $message) !== 1
                && preg_match('/\[javascript error\].+global code@.+.salonanswer.com\/sas\/reservations\/graph/s', $message) !== 1
                && preg_match('/\[javascript error\].+ReferenceError:.+is not defined/s', $message) !== 1
                && preg_match('/\[javascript error\].+TypeError:.+is not a function/s', $message) !== 1
                && preg_match('/\[javascript error\].+fireWith@.+\.js/s', $message) !== 1
                && preg_match('/\[javascript error\].+ready@.+\.js/s', $message) !== 1
                && preg_match('/\[javascript error\].+TypeError: Cannot set property.+scrollTop/s', $message) !== 1
                && preg_match('/\[javascript error\].+TypeError: Cannot read property \'y\' of undefined/s', $message) !== 1
                && preg_match('/\[javascript error\].+TypeError: Cannot read property \'start\' of undefined/s', $message) !== 1
                && preg_match('/\[javascript error\].+RangeError: Maximum call stack size exceeded.+/s', $message) !== 1
                && preg_match('/\[javascript error\].+js\/daypilot\/daypilot-scheduler\.src\.js\?[0-9]+:[0-9]+:[0-9]+\[row:[0-9]+ col:[0-9]+\]/s', $message) !== 1

                && (
                    empty($data['user_agent'])
                    || (
                        strpos($data['user_agent'], 'edge]') === false
                        && strpos($data['user_agent'], 'Edge/') === false
                        && strpos($data['user_agent'], 'iPhone; CPU iPhone OS') === false
                        && strpos($data['user_agent'], 'compatible; bingbot') === false
                        && strpos($data['user_agent'], 'compatible; Googlebot') === false
                    )
                )
            ) {
                // 短時間で同じ内容のエラーがチャットワークに飛ばないようにします。
                $memcached = new \Memcached();
                $memcached->addServer(WEB_RESERVE_MEMCACHED_HOSTNAME, WEB_RESERVE_MEMCACHED_PORT);

                // Memcached に自分のsessionID をセットすることで memcached サービスの起動確認を行います。
                // memcachedが使用可能かチェックしたいだけなので有効期限は1秒にしておきます。
                $date = new FrozenTime();
                $key = 'ErrorLog' . md5($message);
                $isRunning = $memcached->add($key . $date->format('_Y-m-d-H:i:s.u'), 'test', 1); // 起動テスト

                $messageChat = '';
                $messageChat .= substr($data['operation_datetime_key'], 0, strlen('1900-01-01 00:00:00.000')). "\n";
                $messageChat .= $data['user_name']. ' ['. $data['app_user_id']. ']'. "\n";
                $messageChat .= $data['ec2_instance_name']. "\n";
                $messageChat .= "\n";
                $messageChat .= $message;
                if ( $isRunning ) {
                    // Memcached にlock用データをセット ※add()メソッドはkeyが重複するとfalseが返ります。
                    if ( $memcached->add($key, 'test', 60) ) {  // 1分保持
                        $this->pushToChartWork($messageChat);
                    }
                } else {
                    $this->pushToChartWork($messageChat);
                }

                // Slack にも通知
//                $this->pushToSlack(var_export($defaultData, true) . PHP_EOL . $message);
            }
        }
    }

    // /**
    //  * @param \Cake\Controller\Component\CookieComponent $cookieObj
    //  * @param $context
    //  * @return array
    //  */
    // private function getLogBaseData($cookieObj, $context)
    // {
    //     $data = $cookieObj->read(COOKIE_POCKET_BEAUTY_LOG_BASE_DATA);
    //     if (!empty($data) && empty($context['updateFlagPocketBeautyLogBaseData'])) {
    //         return $data;
    //     }

    //     $tableAppUsers      = TableRegistry::get('AppUsers');      /** @var \App\Model\Table\AppUsersTable $tableAppUsers */
    //     $tableAppUserStores = TableRegistry::get('AppUserStores'); /** @var \App\Model\Table\AppUserStoresTable $tableAppUserStores */
    //     $tableApps          = TableRegistry::get('Apps');          /** @var \App\Model\Table\AppsTable $tableApps */
    //     $tableAppStores     = TableRegistry::get('AppStores');     /** @var \App\Model\Table\AppStoresTable $tableAppStores */
    //     $tableStores        = TableRegistry::get('Stores');        /** @var \App\Model\Table\StoresTable $tableStores */

    //     $deviceKey = $cookieObj->read(COOKIE_DEVICE_KEY);
    //     $appUser = $tableAppUsers->getEffectiveOneByDeviceKey($deviceKey);
    //     $appUserStore = $appStore = $app = $store = null;
    //     if (!empty($appUser)) {
    //         $app = $tableApps->get($appUser->app_id);
    //         $appUserStore = $tableAppUserStores->getMainStoreByUserId($appUser->id);
    //         if (!empty($appUserStore)) {
    //             $appStore = $tableAppStores->get($appUserStore->app_store_id);
    //             $store = $tableStores->get($appStore->store_id);
    //         }
    //     }

    //     $data = \App\Utils\SACommon::getPocketBeautyLogBaseData($deviceKey, $appUser, $appStore, $app, $store);

    //     return $data;
    // }

    private function _formatShortMessage($message)
    {
        $message = preg_replace('/^[a-zA-Z0-9\/]+.php\([0-9]+\) /', '', $message);
        $sufix = mb_strlen($message) > 50 ? ' ...' : '';
        $message = mb_substr($message, 0, 50). $sufix;

        return $message;
    }

    private function _formatUrlShort($url)
    {
        $sufix = mb_strlen($url) > 40 ? ' ...' : '';
        $url = mb_substr($url, 0, 40). $sufix;

        return $url;
    }
}
