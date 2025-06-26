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
 * Class DynamoDBLog
 * @package Cake\Log\Engine
 */
class DynamoDBLog extends BaseLog
{
    /**
     * @param mixed $level
     * @param string $message
     * @param array $context
     * @return null|void
     */
    public function log($level, $message, array $context = [])
    {
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
        $cookieObj = $comp->load("Cookie", ["className" => "Cake\Controller\Component\CookieComponent"]);

        // ユーザー情報の取得
        $usersRepository = TableRegistry::get('Users');
        $user = null;
        if (!empty($_SESSION[PROJECT_PREFIX]['Session']['UserId'])) {
            $user = $usersRepository->get($_SESSION[PROJECT_PREFIX]['Session']['UserId']);
        }

        // メッセージ
        // $message = \App\Utils\SACommon::utf8mb4_encode_numericentity($message);
        // $message = $this->_format($message);
		$message = ''; 

        // ロードバランサー環境で、ローカルのIPを正しく取得する為の設定。
        $request->trustProxy = true;

        $data = [
            'operation_datetime_key' => $operationDatetime. ' '. WEBROOT_DIR_NAME. ' '. $uniqueId,
            'email_key' => ''. ' '. WEBROOT_DIR_NAME,
            'log_level_key' => $level. ' '. WEBROOT_DIR_NAME,
            'store_key' => '0-0-0'. ' '. WEBROOT_DIR_NAME,

            'ec2_instance_name' => EC2_INSTANCE_NAME,
            'head_company_id' => 0,
            'company_id' => 0,
            'store_id' => 0,
            'user_id' => 0,
            'user_name' => '',
            'is_cookie' => false,
            'user_agent' => $request->env('HTTP_USER_AGENT'),
            'ip_address' => $request->clientIp(),
            'url' => '',
            'url_short' => '',
            'message' => $message,
            'message_short' => $this->_formatShortMessage($message),
            'is_cookie' => $cookieObj->read(COOKIE_USER_CAN_USE_COOKIE) ? 1 : 0,
            'ios_appli_no' => $cookieObj->read(COOKIE_IOS_APPLI_NO) ?: '',
            'ios_appli_version' => $cookieObj->read(COOKIE_IOS_APPLI_VERSION) ?: '',
            'ttl' => FrozenTime::now()->addMonth(2)->getTimestamp(),  // DynamoDB の TTL (Time To Live) 機能用、2か月経過したものは自動的に消える。AWS Backup で月に一度バックアップが取られ、それは 15ヶ月保持される。
        ];

        if (isset($_SERVER) && !empty($_SERVER['REQUEST_URI'])) {
            $data['url'] = $_SERVER['REQUEST_URI'];
            $data['url_short'] = $this->_formatUrlShort($data['url']);
        }

        if ( strpos($message, '[SmartyException]') !== false ) {
            $data['log_level_key'] = enums()->LogLevel->ERROR_SMARTY->text. ' '. WEBROOT_DIR_NAME;
        }

        // セッションから[企業本部][企業][店舗]のIDを取得
        $headCompanyId = !empty($_SESSION[PROJECT_PREFIX]['TargetHeadCompanyId']) ? $_SESSION[PROJECT_PREFIX]['TargetHeadCompanyId'] : null;
        $companyId     = !empty($_SESSION[PROJECT_PREFIX]['TargetCompanyId'])     ? $_SESSION[PROJECT_PREFIX]['TargetCompanyId']     : null;
        $storeId       = !empty($_SESSION[PROJECT_PREFIX]['TargetStoreId'])       ? $_SESSION[PROJECT_PREFIX]['TargetStoreId']       : null;

        // ユーザー情報が取得できていた場合
        if (!empty($user)) {
            /** @var \App\Model\Entity\User $user */
            $data['user_id'] = $user->id;
            $data['email_key'] = $user->email. ' '. WEBROOT_DIR_NAME;
            $data['user_name'] = $user->user_name;
            if (empty($headCompanyId)) {
                $headCompanyId = $user->head_company_id;
            }
            if (empty($companyId)) {
                $companyId = $user->company_id;
            }
            if (empty($storeId)) {
                $storeId = $user->store_id;
            }
        }
        // 企業本部ID
        if (!empty($headCompanyId)) {
            $data['head_company_id'] = $headCompanyId;
        }
        // 企業ID
        if (!empty($companyId)) {
            $data['company_id'] = $companyId;
        }
        // 店舗ID
        if (!empty($storeId)) {
            $data['store_id'] = $storeId;
        }

        $data['store_key'] = $data['head_company_id']. '-'. $data['company_id']. '-'. $data['store_id']. ' '. WEBROOT_DIR_NAME;

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

            $tableName = DYNAMO_DB_TABLE_NAME_OPERATION_LOGS;

            $dynamoDbClient->putItem([
                'TableName' => $tableName,
                'Item' => $marshaler->marshalItem($data),
            ]);
        } catch (\Exception $exception) {
            $data['operation_date'] = (new FrozenTime($sec))->format('Y-m-d H:i:s');
            $data['email'] = str_replace(' '. WEBROOT_DIR_NAME, '', $data['email_key']);
            $data['level'] = strtoupper(str_replace(' '. WEBROOT_DIR_NAME, '', $data['log_level_key']));

            /** @var \App\Model\Table\LogOperationsTable $logOperations */
            // OperationLogs : app.config で設定してあるもの
            $logOperations = TableRegistry::get('LogOperations');
            $conn = ConnectionManager::get('log');
            $logOperations->connection($conn);

            /** @var \App\Model\Entity\LogOperation $logOperation */
            $logOperation = $logOperations->newEntity($data);

            $logOperations->save($logOperation);

            $message = $exception->getMessage();
            $message .= "\r\n". $exception->getFile(). '('. $exception->getLine(). ')';
            $message .= "\r\n\r\n". $exception->getTraceAsString();

            $data['message'] = $message;
            $data['level'] = enums()->LogLevel->ERROR->text;

            $logOperation = $logOperations->newEntity($data);
            $logOperations->save($logOperation);
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
                $messageChat .= $data['user_name']. "\n";
                $messageChat .= str_replace(' '. WEBROOT_DIR_NAME, '', $data['email_key']). "\n";
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

    private function pushToChartWork($message) {
        $url = 'https://api.chatwork.com/v2/rooms/' . ERROR_LOG_CHAT_WORK_ROOM_ID . '/messages';

        $curl = curl_init();
        $headers[] = "X-ChatWorkToken: " . ERROR_LOG_CHAT_API_TOKEN;

        $option = [
            CURLOPT_URL => $url,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_HEADER => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => $headers,
        ];

        $body  = "[toall]\n[info]";
        $body .= $message;
        $body .= '[/info]';

        $data['body'] = $body;
        $option[CURLOPT_POSTFIELDS] = $data;

        curl_setopt_array($curl, $option);
        $response = curl_exec($curl);

        $headerSize = curl_getinfo($curl, CURLINFO_HEADER_SIZE);
        $header = substr($response, 0, $headerSize);
        $body = substr($response, $headerSize);

        curl_close($curl);

        // チャットに送れない場合のデバッグ用
//        file_put_contents(LOGS.'chat_work_response.txt', (new \DateTime())->format('Y-m-d H:i:s '). print_r(compact('header', 'body'), true)."\r\n", FILE_APPEND);
    }

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
