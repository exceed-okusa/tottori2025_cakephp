<?php
namespace Utils\enums\Enum\EnumItem;

use Utils\enums\Enum\Enum;

require_once(ROOT . DS . 'src' . DS . 'Utils' . DS . 'enums' . DS  . 'Enum.php');

/**
 * Class PageMode
 * @package Utils\enums\Enum\EnumItem
 * @property \Utils\enums\Enum\ItemEnum $LIST
 * @property \Utils\enums\Enum\ItemEnum $DETAIL
 * @property \Utils\enums\Enum\ItemEnum $ADD
 * @property \Utils\enums\Enum\ItemEnum $EDIT
 */
Final Class PageMode extends Enum
{
    // public どこからでも呼び出せるという意味の変数
    public $LIST;
    public $DETAIL;
    public $ADD;
    public $EDIT;

    public function __construct(){
        $this->LIST 	= array('value' => 1, 'text' => '一覧', 'description' => "");
        $this->DETAIL  	= array('value' => 2, 'text' => '詳細', 'description' => "");
        $this->ADD      = array('value' => 3, 'text' => '登録', 'description' => "");
        $this->EDIT     = array('value' => 4, 'text' => '編集', 'description' => "");
        parent::__construct();
    }
}
