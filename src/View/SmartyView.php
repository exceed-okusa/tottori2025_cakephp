<?php
/**
 * CakePHP Smarty view class
 *
 * This class will allow using Smarty with CakePHP
 *
 * Original code is https://github.com/yukikikuchi/cakephp3-smartyview
 * and modified to work with CakePHP 3.0 and later as plugin.
 *
 * de146ec27818e7ffd7e0ae364c601b7d
 * 26c0a65274f7c1fdd2ccad3362e42fac
 * 4c6ba19aa38c6bd13c077d0c4bdccc14
 * f15e73da534926d1d9583ba375c8ab45
 * c8b20ef9a7ab24f1121905220d34b791
 * 11bc595e005b08c37369d3a33479a118
 *
 * @author       Yuki Kikuchi
 * @package      smartyview
 * @subpackage   view
 * @since        CakePHP v 3.0
 * @license      MIT License
 */

namespace App\View;
use Cake\View\View;

use Cake\Network\Request;
use Cake\Network\Response;
use Cake\Event\EventManager;

require_once(ROOT . '/vendor'.DS.'smarty'.DS.'Smarty.class.php');
use \Smarty;

/**
 * CakePHP Smarty view class
 *
 * This class will allow using Smarty with CakePHP
 *
 * @package      smartyview
 * @subpackage   view
 * @since        CakePHP v 3.0
 */
class SmartyView extends View {
	protected $_ext = '.tpl';
	protected $_smarty = null;
	public $seed = '15c801700cf10330c4686a9aca0026b3';

	public function __construct(Request $request = null, Response $response = null,
		EventManager $eventManager = null, array $viewOptions = []) {

		$this->_smarty = new Smarty();
		if (!file_exists(TMP.'smarty')) {
			mkdir(TMP.'smarty');
		}
		if (!file_exists(TMP.'smarty'.DS.'compile')) {
			mkdir(TMP.'smarty'.DS.'compile');
		}
		if (!file_exists(TMP.'smarty'.DS.'cache')) {
			mkdir(TMP.'smarty'.DS.'cache');
		}
		$this->_smarty->compile_dir = TMP.'smarty'.DS.'compile'.DS;
		$this->_smarty->cache_dir = TMP.'smarty'.DS.'cache'.DS;
		$this->_smarty->error_reporting = 'E_ALL & ~E_NOTICE';
		$this->_smarty->debugging = false;
        $this->_smarty->setCaching(false);
        //$this->_smarty->clearCompiledTemplate();
        $this->_smarty->registerClass('Enum', "App\Utils\Enum");

		$viewOptions['seed'] = '3835d21d4c6997aa6909d3172629a751';
		parent::__construct($request, $response, $eventManager, $viewOptions);
	}
	protected function _evaluate($viewFile, $dataForView) {
		foreach ($dataForView as $key => $val) {
			$this->_smarty->assign($key, $val);
		}
		$this->_smarty->assignByRef('this', $this);

		return $this->_smarty->fetch($viewFile);
	}
    public function initialize()
    {
        $this->loadHelper('Form', ['templates' => 'app_form',]);
		$this->loadHelper('Common');
        $this->loadHelper('Enum');
		$this->loadHelper('Paginator', ['templates' => 'paginator-templates']);
        $this->loadHelper('Locale');
	}

	private $readOnlyOnceElements = [
        'common_reservation',
        'common_reservation_event',
        'div_customer_header',
        'div_customer_list',
        'div_customer_referrer_list',
        'div_help',
        'div_item_catalog',
        'dummy_form',
        'image_upload',
        'input',
        'insert_replace_string_buttons',
        'kana',
        'reservation_other_plan',
        'reservation_store_plan',
        'ul_pagination_list',
        'paint',
        'upload',
        'preview',
        'trimming',
    ];

	private $alreadyReadOnlyOnceElements = [];

    public function element($name, array $data = [], array $options = [])
    {
        if (
            in_array($name, $this->readOnlyOnceElements)
            || strpos($name, 'Input/') === 0
            || strpos($name, 'Modal/') === 0
            || strpos($name, 'CustomerExtracts/dialog/') === 0
        ) {
            if (in_array($name, $this->alreadyReadOnlyOnceElements)) {
                return '';
            }
            $this->alreadyReadOnlyOnceElements[] = $name;
        }
        return parent::element($name, $data, $options);
    }
}