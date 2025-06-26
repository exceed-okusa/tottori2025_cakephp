<?php

namespace Cake\Log\Engine;

use Cake\Controller\ComponentRegistry;
use Cake\Datasource\ConnectionManager;
use Cake\I18n\FrozenTime;
use Cake\Network\Request;
use Cake\ORM\TableRegistry;

/**
 * Database に Log レコードを作成する Class.
 *
 * @package   Cake\Log\Engine
 */
class DatabaseLog extends BaseLog
{
    protected $_defaultConfig = [
        'types'   => null,
        'levels'  => [],
        'scopes'  => [],
        'user_id' => null
    ];

    /**
     * {@inheritDoc}
     *
     * @param mixed  $level
     * @param string $message
     * @param array  $context
     * @return void
     */
    public function log($level, $message, array $context = [])
    {
        $request = new Request();
        $now = new FrozenTime();

        /** @var \App\Model\Table\LogOperationsTable $logOperations */
        // OperationLogs : app.config で設定してあるもの
        $logOperations = TableRegistry::get($this->_config['model']);
        $conn = ConnectionManager::get('log');
        $logOperations->connection($conn);

        // Cookie Component の読み込み
        $comp = new ComponentRegistry();
        $cookieObj = $comp->load("Cookie", ["className" => "Cake\Controller\Component\CookieComponent"]);

        // ユーザー情報の取得
        $usersRepository = TableRegistry::get('Users');
        /** @var \App\Model\Entity\User $user */
        $user = null;
        if (!empty($_SESSION[PROJECT_PREFIX]['Session']['UserId'])) {
            $user = $usersRepository->get($_SESSION[PROJECT_PREFIX]['Session']['UserId']);
        }

        // メッセージ
        // $message = \App\Utils\SACommon::utf8mb4_encode_numericentity($message);
        // $message = $this->_format($message);

        // メッセージが mySQL の text 型の最大長を超える場合、複数回に分けてDB登録
        // 最大長は 65535 ですが、余裕を見て 50000 ずつ切り分けるようにしています。
        // $maxRepeatCount = 3;
        // if (50000 * $maxRepeatCount < strlen($message)) {
        //     // あまりに長いメッセージは最後を切る。（エラーで落ちてしまうため）
        //     $message = substr($message, 0, 50000 * $maxRepeatCount);
        // }
        // if (50000 < strlen($message)) {
        //     for ($i = 1; 50000 < strlen($message); $i++) {
        //         $this->log($level, substr($message, 50000 * ($i-1), 50000), $context);
        //         $message = substr($message, 50000 * $i);
        //     }
        // }

        // ロードバランサー環境で、ローカルのIPを正しく取得する為の設定。
        $request->trustProxy = true;

        // Default の Data の作成
        $defaultData = [
            'operation_date'  => $now->format('Y-m-d H:i:s'),
            'level'           => strtoupper($level),
            'is_cookie'       => enums()->GeneralFlag->OFF->getValue(),
            'user_agent'      => $request->env('HTTP_USER_AGENT'),
            'ip_address'      => $request->clientIp(),
            'url'             => '',
            'message'         => $message
        ];

        /** @var \App\Model\Entity\LogOperation $logOperation */
        $logOperation = $logOperations->newEntity($defaultData, ['validate'=>false]);

        if (isset($_SERVER) && !empty($_SERVER['REQUEST_URI'])) {
            $logOperation->url = $_SERVER['REQUEST_URI'];
        }

        if ( strpos($message, '[SmartyException]') !== false ) {
            $logOperation->level = enums()->LogLevel->ERROR_SMARTY->getText();
        }

        // PocketSalon用API から呼ばれたかどうか RequestQuery から判定
        $pocketSalonApiFlag = false;
//        $constKey = POCKET_SALON_API_JUDGMENT_KEY;
//        foreach ($_POST as $key => $value) {
//            if (preg_match("/$constKey$/", $key)) {
//                $pocketSalonApiFlag = true;
//                break;
//            }
//        }

        // ポケサロのAPIから呼ばれている場合
        if ($pocketSalonApiFlag) {
            // 企業本部ID
            $headCompanyId = array_key_exists('head_company_id', $_POST) ? $_POST['head_company_id'] : null;
            if (!empty($headCompanyId)) {
                $logOperation->head_company_id = $headCompanyId;
            }
            // 企業ID
            $companyId = array_key_exists('company_id', $_POST) ? $_POST['company_id'] : null;
            if (!empty($companyId)) {
                $logOperation->company_id = $companyId;
            }
            // 店舗ID
            $storeId = array_key_exists('store_id', $_POST) ? $_POST['store_id'] : null;
            if (!empty($storeId)) {
                $logOperation->store_id = $storeId;
            }
        } else {
            $logOperation->is_cookie = $cookieObj->read(COOKIE_USER_CAN_USE_COOKIE) ? 1 : 0;
            $logOperation->ios_appli_no = $cookieObj->read(COOKIE_IOS_APPLI_NO);
            $logOperation->ios_appli_version = $cookieObj->read(COOKIE_IOS_APPLI_VERSION);

            $headCompanyId = !empty($_SESSION[PROJECT_PREFIX]['TargetHeadCompanyId']) ? $_SESSION[PROJECT_PREFIX]['TargetHeadCompanyId'] : null;
            $companyId     = !empty($_SESSION[PROJECT_PREFIX]['TargetCompanyId'])     ? $_SESSION[PROJECT_PREFIX]['TargetCompanyId']     : null;
            $storeId       = !empty($_SESSION[PROJECT_PREFIX]['TargetStoreId'])       ? $_SESSION[PROJECT_PREFIX]['TargetStoreId']       : null;

            // ユーザー情報が取得できていた場合
            if (!empty($user)) {
                $logOperation->user_id = $user->id;
                $logOperation->authority = $user->authority;
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
                $logOperation->head_company_id = $headCompanyId;
            }
            // 企業ID
            if (!empty($companyId)) {
                $logOperation->company_id = $companyId;
            }
            // 店舗ID
            if (!empty($storeId)) {
                $logOperation->store_id = $storeId;
            }
        }

        // 保存
        $logOperations->save($logOperation);
    }
}