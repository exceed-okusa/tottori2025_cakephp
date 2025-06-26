<?php
namespace Utils\enums\Enum\EnumItem;

use Utils\enums\Enum\Enum;

require_once(ROOT . DS . 'src' . DS . 'Utils' . DS . 'enums' . DS  . 'Enum.php');

/**
 * Class Authority
 * @package Utils\enums\Enum\EnumItem
 * @property \Utils\enums\Enum\ItemEnum $STUDENT
 * @property \Utils\enums\Enum\ItemEnum $TEACHER
 * @property \Utils\enums\Enum\ItemEnum $SYSTEM_ADMINISTRATOR
 */
Final Class Authority extends Enum
{
    public $STUDENT;
    public $TEACHER;
    public $SYSTEM_ADMINISTRATOR;

    public function __construct(){
        $this->STUDENT 				 = array('value' => 0, 'text' => '学生', 'description' => "");
        $this->TEACHER  			 = array('value' => 1, 'text' => '教員', 'description' => "");
        $this->SYSTEM_ADMINISTRATOR  = array('value' => 9, 'text' => 'システム管理者', 'description' => "");
        parent::__construct();
    }
}
