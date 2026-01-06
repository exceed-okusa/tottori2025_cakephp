<?php
namespace Utils\enums\Enum\EnumItem;

use Utils\enums\Enum\Enum;

require_once(ROOT . DS . 'src' . DS . 'Utils' . DS . 'enums' . DS  . 'Enum.php');

/**
 * Class StudyArea
 * @package Utils\enums\Enum\EnumItem
 * @property \Utils\enums\Enum\ItemEnum $MATHEMATICS
 * @property \Utils\enums\Enum\ItemEnum $EDUCATION
 * @property \Utils\enums\Enum\ItemEnum $LIBERAL_ARTS
 * @property \Utils\enums\Enum\ItemEnum $UNCATEGORIZED
 */
Final Class StudyArea extends Enum
{
    public $MATHEMATICS;
    public $EDUCATION;
    public $LIBERAL_ARTS;
    public $UNCATEGORIZED;

    public function __construct(){
        $this->MATHEMATICS   = array('value' => 1, 'text' => '数学', 'description' => "");
        $this->EDUCATION     = array('value' => 2, 'text' => '教育', 'description' => "");
        $this->LIBERAL_ARTS  = array('value' => 3, 'text' => '一般教養', 'description' => "");
        $this->UNCATEGORIZED = array('value' => 99, 'text' => '未分類', 'description' => "");
        parent::__construct();
    }
}
