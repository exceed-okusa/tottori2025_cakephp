<?php

namespace App\Controller;

use App\Utils\Enum;
use Cake\Controller\Controller;
use Cake\Event\Event;

/**
 * Application Controller
 *
 * @property \App\Model\Table\LecturesTable $Lectures
 * @property \App\Model\Table\UsersTable 	$Users
 *
 * @property string $dbNameDefault
 * @property string $dbNameHcTemplate
 * @property string $dbNameHc
 * @property string $dbNameApp
 * @property \App\Model\Entity\User $loginUser
 * @property integer $targetHeadCompanyId
 * @property integer $targetCompanyId
 * @property integer $targetStoreId
 * @property \Cake\I18n\FrozenDate $targetDate
 * @property integer $posOpenFlag
 * @property array $referableStoreIds
 * @property Enum $Enum
 * @property \App\Utils\BaseConnection $connection
 * @property \App\Shell\BaseShell $shell
 * @property \App\Utils\SystemCompany $systemCompany
 * @property \App\Utils\SystemStore $systemStore
 * @property \App\Utils\SystemUser $systemUser
 * @property string $systemEnvironmentType
 * @property bool $isFromIOs
 */
class AppController extends Controller
{
    /** @var string $viewClass Smartyを利用する為の定義 */
    public $viewClass = 'App\View\SmartyView';

    public $dbNameDefault = '';
    public $dbNameHcTemplate = '';
    public $dbNameHc = '';

    public $loginUser = null;
    public $targetHeadCompanyId = null;
    public $targetCompanyId = null;
    public $targetStoreId = null;
    public $targetDate = null;

    public $Enum;
    public $connection = null;
    public $shell = null;

    /**
     * Initialization hook method.
     *
     * Use this method to add common initialization code like loading components.
     *
     * e.g. `$this->loadComponent('Security');`
     *
     * @return void
     */
    public function initialize()
    {
        parent::initialize();

        $this->loadComponent('RequestHandler');
        $this->loadComponent('Flash');

        /*
         * Enable the following components for recommended CakePHP security settings.
         * see https://book.cakephp.org/3.0/en/controllers/components/security.html
         */
        //$this->loadComponent('Security');
        //$this->loadComponent('Csrf');

        $this->Enum = new Enum();
        $this->Enum->_parent = $this;
    }

    /**
     * Before render callback.
     *
     * @param Event $event The beforeRender event.
     * @return \Cake\Network\Response|null|void
     */
    public function beforeRender(Event $event)
    {
        // Note: These defaults are just to get started quickly with development
        // and should not be used in production. You should instead set "_serialize"
        // in each action as required.
        if (!array_key_exists('_serialize', $this->viewVars) &&
            in_array($this->response->type(), ['application/json', 'application/xml'])
        ) {
            $this->set('_serialize', true);
        }
    }

    /**
     * Controller 名を取得するメソッド.
     * ※ CakePHP の今後のバージョンアップを考慮.
     *
     * @since 1.0.0 i-takahashi  First time this was introduced.
     * @return string
     */
    protected function getControllerName()
    {
        return $this->name;
    }

    /**
     * アクション名を取得する為のメソッド.
     * ※ CakePHP の今後のバージョンアップを考慮.
     *
     * @since 1.0.0 i-takahashi  First time this was introduced.
     * @return string
     */
    protected function getActionName()
    {
        return $this->request->action;
    }

    /**
     * AjaxによるRequestを判定して返すメソッド.
     * ※ CakePHP の今後のバージョンアップを考慮.
     *
     * @since 1.0.0 i-takahashi  First time this was introduced.
     * @return bool
     */
    protected function isAjax()
    {
        return $this->request->is('ajax');
    }

    /**
     * AjaxによるRequestを判定して返すメソッド.
     * ※ CakePHP の今後のバージョンアップを考慮.
     *
     * @since 1.0.0 i-takahashi  First time this was introduced.
     * @return bool
     */
    protected function isNotAjax()
    {
        return !$this->isAjax();
    }
}
