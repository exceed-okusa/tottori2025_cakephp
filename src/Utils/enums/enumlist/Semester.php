<?php
namespace Utils\enums\Enum\EnumItem;

use Utils\enums\Enum\Enum;

require_once(ROOT . DS . 'src' . DS . 'Utils' . DS . 'enums' . DS  . 'Enum.php');

/**
 * Class Semester
 * @package Utils\enums\Enum\EnumItem
 * @property \Utils\enums\Enum\ItemEnum $FIRST_SEMESTER
 * @property \Utils\enums\Enum\ItemEnum $SECOND_SEMESTER
 */
Final Class Semester extends Enum
{
    public $FIRST_SEMESTER;
    public $SECOND_SEMESTER;

    public function __construct(){
        $this->FIRST_SEMESTER  = array('value' => 1, 'text' => '前期', 'description' => "");
        $this->SECOND_SEMESTER = array('value' => 2, 'text' => '後期', 'description' => "");
        parent::__construct();
    }
}
