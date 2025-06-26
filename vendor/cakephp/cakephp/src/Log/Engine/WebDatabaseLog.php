<?php
namespace Cake\Log\Engine;

use App\Model\Table\WebStoresTable;
use App\Utils\Reserve\ReserveUserSession;
use Cake\Datasource\ConnectionManager;
use Cake\I18n\FrozenTime;
use Cake\Network\Request;
use Cake\ORM\TableRegistry;

/**
 * Database に Log レコードを作成する Class.
 *
 * @package   Cake\Log\Engine
 */
class WebDatabaseLog extends BaseLog
{
    protected $_defaultConfig = [
        'levels' => [],
        'scopes' => [],
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

        // Web操作ログの接続先情報を取得
        $model = TableRegistry::get($this->_config['model']);
        $conn = ConnectionManager::get($this->_config['datasource']);
        $model->connection($conn);

        // Web店舗コードを取得
        $webStoreCode = null;
        if( array_key_exists('params', $this->_config) && is_array($this->_config['params']) ) {
            if( array_key_exists(WEB_RESERVE_REQUEST_KEY_WEB_STORE_CODE, $this->_config['params']) ) {
                $webStoreCode = $this->_config['params'][ WEB_RESERVE_REQUEST_KEY_WEB_STORE_CODE ];
            }
        }

        $webStore = null;
        $webCustomerId = null;

        if( !empty($webStoreCode) ) {
            /** @var WebStoresTable $webStoreRepository */
            $webStoreRepository = TableRegistry::get('WebStores');

            // Web店舗を取得
            $webStore = $webStoreRepository->getEffectiveOneByWebStoreCode($webStoreCode);

            // Session からログイン中の Web顧客ID を取得
            if( !empty($_SESSION) && !empty($_SESSION[ PROJECT_PREFIX ]) ) {
                if( array_key_exists('Reserve', $_SESSION[ PROJECT_PREFIX ]) ) {
                    $userSessions = unserialize($_SESSION[ PROJECT_PREFIX ]['Reserve']);
                    if( !empty($userSessions) && array_key_exists($webStoreCode, $userSessions) ) {
                        /** @var ReserveUserSession $userSession */
                        $userSession = $userSessions[ $webStoreCode ];
                        $webCustomerId = $userSession->webCustomerId;
                    }
                }
            }
        }

        // メッセージ
        // $message = SACommon::utf8mb4_encode_numericentity($message);
        // $message = $this->_format($message);

        // // メッセージが mySQL の text 型の最大長を超える場合、複数回に分けてDB登録
        // // 最大長は 65535 ですが、余裕を見て 50000 ずつ切り分けるようにしています。
        // $maxRepeatCount = 10;
        // if( 50000 * $maxRepeatCount < strlen($message) ) {
        //     // あまりに長いメッセージは最後を切る。（エラーで落ちてしまうため）
        //     $message = substr($message, 0, 50000 * $maxRepeatCount);
        // }
        // if( 50000 < strlen($message) ) {
        //     for( $i = 1; 50000 < strlen($message); $i++ ) {
        //         $this->log($level, substr($message, 50000 * ($i - 1), 50000), $context);
        //         $message = substr($message, 50000 * $i);
        //     }
        // }

        // ロードバランサー環境で、ローカルのIPを正しく取得する為の設定。
        $request->trustProxy = true;

        $defaultData = [
            'operation_date'    => $now->format('Y-m-d H:i:s'),
            'level'             => strtoupper($level),
            'is_cookie'         => enums()->GeneralFlag->OFF->value,
            'user_agent'        => $request->env('HTTP_USER_AGENT'),
            'ip_address'        => $request->clientIp(),
            'cloud_function_id' => 1031,    // TODO
            'message'           => $message,
            'referer'           => $request->env('HTTP_REFERER'),
        ];

        if( !empty($webCustomerId) ) {
            $defaultData['web_customer_id'] = $webCustomerId;
        }

        if( !empty($webStore) ) {
            $defaultData['head_company_id'] = $webStore->head_company_id;
            $defaultData['company_id'] = $webStore->company_id;
            $defaultData['store_id'] = $webStore->store_id;
        }

        if (!empty($_COOKIE) && is_array($_COOKIE)) {
            $defaultData['is_cookie'] = enums()->GeneralFlag->ON->value;
        }

        // 保存
        $entity = $model->newEntity($defaultData);
        $model->save($entity);
    }
}