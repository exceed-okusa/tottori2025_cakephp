<?php

namespace App\Utils;

/**
 * Class Enum
 *
 * @property \Utils\enums\Enum\EnumItem\Authority $Authority
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
                if (!empty($this->_parent)) {
                    $this->$name->_systemCompany = $this->_parent->systemCompany;
                    $this->$name->_systemStore = $this->_parent->systemStore;
                }
            } else {
                throw new \Exception(ROOT . '/src/Utils/enums/enumlist/' . $name . '.php が存在しません。');
            }
        }
        return $this->$name;
    }
}