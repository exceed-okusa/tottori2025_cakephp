<?php
namespace Utils\enums\Enum\EnumItem;

use Utils\enums\Enum\Enum;

require_once(ROOT . DS . 'src' . DS . 'Utils' . DS . 'enums' . DS  . 'Enum.php');

/**
 * Class HowToParticipate
 * @package Utils\enums\Enum\EnumItem
 * @property \Utils\enums\Enum\ItemEnum $ATTENDANCE
 * @property \Utils\enums\Enum\ItemEnum $TARDINESS
 * @property \Utils\enums\Enum\ItemEnum $ABSENCE
 */
Final Class HowToParticipate extends Enum
{
    public $ATTENDANCE;
    public $TARDINESS;
    public $ABSENCE;

    public function __construct(){
        $this->ATTENDANCE   = array('value' => 1, 'text' => '〇', 'description' => "");
        $this->TARDINESS    = array('value' => 2, 'text' => '△', 'description' => "");
        $this->ABSENCE      = array('value' => 3, 'text' => '✖', 'description' => "");
        parent::__construct();
    }
}
