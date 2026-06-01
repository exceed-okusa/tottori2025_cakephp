<?php
namespace Utils\enums\Enum\EnumItem;

use Utils\enums\Enum\Enum;

require_once(ROOT . DS . 'src' . DS . 'Utils' . DS . 'enums' . DS  . 'Enum.php');

/**
 * Class AttendanceStatus
 * @package Utils\enums\Enum\EnumItem
 * @property \Utils\enums\Enum\ItemEnum $ATTENDANCE
 * @property \Utils\enums\Enum\ItemEnum $LATENESS
 * @property \Utils\enums\Enum\ItemEnum $ABSENCE
 */
Final Class AttendanceStatus extends Enum
{
    public $ATTENDANCE;
    public $LATENESS;
    public $ABSENCE;

    public function __construct(){
        $this->ATTENDANCE = array('value' => 0, 'text' => '出席', 'description' => "〇");
        $this->LATENESS   = array('value' => 1, 'text' => '遅刻', 'description' => "△");
        $this->ABSENCE    = array('value' => 2, 'text' => '欠席', 'description' => "✕");
        parent::__construct();
    }
}