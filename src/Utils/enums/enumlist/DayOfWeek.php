<?php
namespace Utils\enums\Enum\EnumItem;

use Utils\enums\Enum\Enum;

require_once(ROOT . DS . 'src' . DS . 'Utils' . DS . 'enums' . DS  . 'Enum.php');

/**
 * Class DayOfWeek
 * @package Utils\enums\Enum\EnumItem
 * @property \Utils\enums\Enum\ItemEnum $MONDAY
 * @property \Utils\enums\Enum\ItemEnum $TUESDAY
 * @property \Utils\enums\Enum\ItemEnum $WEDNESDAY
 * @property \Utils\enums\Enum\ItemEnum $THURSDAY
 * @property \Utils\enums\Enum\ItemEnum $FRIDAY
 * @property \Utils\enums\Enum\ItemEnum $SATURDAY
 * @property \Utils\enums\Enum\ItemEnum $SUNDAY
 */
Final Class DayOfWeek extends Enum
{
    public $MONDAY;
    public $TUESDAY;
	public $WEDNESDAY;
	public $THURSDAY;
	public $FRIDAY;
	public $SATURDAY;   
	public $SUNDAY;

    public function __construct(){
        $this->MONDAY    = array('value' => 0, 'text' => '月曜', 'description' => "");
        $this->TUESDAY   = array('value' => 1, 'text' => '火曜', 'description' => "");
		$this->WEDNESDAY = array('value' => 2, 'text' => '水曜', 'description' => "");
        $this->THURSDAY  = array('value' => 3, 'text' => '木曜', 'description' => "");
		$this->FRIDAY    = array('value' => 4, 'text' => '金曜', 'description' => "");
        $this->SATURDAY  = array('value' => 5, 'text' => '土曜', 'description' => "");
		$this->SUNDAY    = array('value' => 6, 'text' => '日曜', 'description' => "");
        parent::__construct();
    }
}
