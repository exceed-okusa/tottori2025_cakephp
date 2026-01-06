<?php

namespace App\Utils;

use Cake\Log\SasLogTrait;

/**
 * Class Enum
 *
 * @property \Utils\enums\Enum\EnumItem\Authority        $Authority
 * @property \Utils\enums\Enum\EnumItem\AttendanceStatus $AttendanceStatus
 * @property \Utils\enums\Enum\EnumItem\ChangeFlag       $ChangeFlag
 * @property \Utils\enums\Enum\EnumItem\DayOfWeek        $DayOfWeek
 * @property \Utils\enums\Enum\EnumItem\InvalidationFlag $InvalidationFlag
 * @property \Utils\enums\Enum\EnumItem\PageMode         $PageMode
 * @property \Utils\enums\Enum\EnumItem\StudyArea        $StudyArea
 */
class Enum
{
    public $_parent = null;

    /**
     * @param $name
     * @return mixed
     * @throws \Exception
     */
    public function __get($name)
    {
        if ( empty($this->$name) ) {
            if ( file_exists(ROOT . '/src/Utils/enums/enumlist/' . $name . '.php') ) {
                $enums = enums();
                $this->$name = $enums->$name;

                // if (!empty($this->_parent)) {
                //     $this->$name->_systemCompany = $this->_parent->systemCompany;
                //     $this->$name->_systemStore = $this->_parent->systemStore;
                // }
            } else {
                throw new \Exception(ROOT . '/src/Utils/enums/enumlist/' . $name . '.php が存在しません。');
            }
        }
        return $this->$name;
    }
}