<?php
namespace Utils\enums\Enum\EnumItem;

use Utils\enums\Enum\Enum;

require_once(ROOT . DS . 'src' . DS . 'Utils' . DS . 'enums' . DS  . 'Enum.php');

/**
 * Class ChangeFlag
 * @package Utils\enums\Enum\EnumItem
 * @property \Utils\enums\Enum\ItemEnum $NOT_CHANGED
 * @property \Utils\enums\Enum\ItemEnum $CHANGED
 */
Final Class ChangeFlag extends Enum
{
    public $NOT_CHANGED;
    public $CHANGED;

    public function __construct(){
        $this->NOT_CHANGED = array('value' => 0, 'text' => '変更なし', 'description' => "");
        $this->CHANGED     = array('value' => 1, 'text' => '変更あり', 'description' => "");
        parent::__construct();
    }
}
