<?php
namespace Utils\enums\Enum\EnumItem;

use Utils\enums\Enum\Enum;

require_once(ROOT . DS . 'src' . DS . 'Utils' . DS . 'enums' . DS  . 'Enum.php');

/**
 * Class InvalidationFlag
 * @package Utils\enums\Enum\EnumItem
 * @property \Utils\enums\Enum\ItemEnum $OFF
 * @property \Utils\enums\Enum\ItemEnum $ON
 */
Final Class InvalidationFlag extends Enum
{
    public $OFF;
    public $ON;

    public function __construct(){
        $this->OFF = array('value' => 0, 'text' => '有効なデータ', 'description' => "");
        $this->ON  = array('value' => 1, 'text' => '無効なデータ', 'description' => "");
        parent::__construct();
    }
}
