<?php

namespace App\Controller;

use App\Utils\BaseConnection;
use App\Utils\Traits\SasLogTrait;
use Cake\Core\Configure;
use Cake\Event\Event;
use Cake\Network\Response;
use Cake\ORM\TableRegistry;
use Cake\Routing\Router;

/**
 * Base Controller
 * ・ 全コントローラで共通のプロパティをセット
 */
class BaseController extends AppController
{
    use SasLogTrait;

    protected $_preUpdateDateStoreOpenUsers = '';

    /**
     * マジックメソッド
     * $this->{テーブル名} で自動的に loadModel される
     * $this->{コンポーネント名} で自動的に loadComponent される
     *
     * @param string $name
     * @return bool|object
     */
    public function __get($name)
    {
        if (class_exists('App\Model\Table\\'. $name. 'Table')) {
            if (TableRegistry::exists($name)) {
                $this->$name = TableRegistry::get($name);
                $this->$name->setDbNameHc($this->dbNameHc);
                $this->$name->setDatabaseAndTable();
            } else {
                $this->$name = TableRegistry::get($name, [
                    'exceedSpecialOptions' => [
                        'dbNameDefault' => $this->dbNameDefault,
                        'dbNameHcTemplate' => $this->dbNameHcTemplate,
                        'dbNameHc' => $this->dbNameHc,
                        'loginUser' => $this->loginUser,
                        'targetHeadCompanyId' => $this->targetHeadCompanyId,
                        'targetCompanyId' => $this->targetCompanyId,
                        'targetStoreId' => $this->targetStoreId,
                        'targetDate' => $this->targetDate,
                        'posOpenFlag' => $this->posOpenFlag,
                        'referableStoreIds' => $this->referableStoreIds,
                        'systemCompany' => $this->systemCompany,
                        'systemStore' => $this->systemStore,
                        'systemUser' => $this->systemUser,
                    ]
                ]);
            }
            return $this->$name;
        } elseif (class_exists('Cake\Controller\Component\\'. $name. 'Component')) {
            $this->loadComponent($name);
            return $this->$name;
        } elseif (class_exists('App\Controller\Component\\'. $name. 'Component')) {
            $this->loadComponent($name);
            return $this->$name;
        } else {
            return parent::__get($name);
        }
    }

    public function initialize()
    {
        parent::initialize();

        $this->connection = new BaseConnection($this);
    }

    public function beforeFilter(Event $event)
    {
        parent::beforeFilter($event);

        // ロードバランサー環境で、ローカルのIPを正しく取得する為の設定。
        $this->request->trustProxy = true;

        $this->Cookie->configKey(
            PROJECT_PREFIX,
            [
                'expires'  => '+1 months',
                'httpOnly' => true,
            ]
        );

        if ($this->isAjax()) {
            $this->viewBuilder()->autoLayout(false);
            $this->viewClass = null;
            Configure::write('debug', false);
            $this->set('_serialize', ['ret']);
            if (!empty($this->request->data['_useJsonStringify'])) {
                $this->request->data = json_decode($this->request->data['data'], true); // 一度にできる POST 数の上限対策(超えたらエラーなしでちょん切れるため)
            }
            if (!empty($this->request->data['_preUpdateDateStoreOpenUsers']) && $this->request->data['_preUpdateDateStoreOpenUsers'] !== 'null') {
                $this->_preUpdateDateStoreOpenUsers = $this->request->data['_preUpdateDateStoreOpenUsers'];
            }
            unset($this->request->data['_preUpdateDateStoreOpenUsers']);
        }
    }

    public function emptyAction()
    {
        // beforeFilter でアクションをこちらに切り替えることで、なにもしないようにする
    }

    public function beforeRender(Event $event)
    {
        parent::beforeRender($event);

        $this->set('webroot', $this->request->webroot);
        $this->set('loginUser', $this->loginUser);
    }

    public function beforeRedirect(Event $event, $url, Response $response)
    {
        if ( !is_array($url) && strpos($url, 'https://') === 0 ) {
            return null;
        }
        // httpsにリダイレクトするように設定
        return $response->location('https://' . $_SERVER["HTTP_HOST"] . Router::url($url));
    }

    
}
