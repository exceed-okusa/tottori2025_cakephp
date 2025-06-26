<?php

/* src/View/Helper/LinkHelper.php */
namespace App\View\Helper;

use Cake\View\Helper;
use App\Utils\Enum;

class EnumHelper extends Helper
{
    private $_enum;

    public function __get($name)
    {
        if (empty($this->_enum)) {
            $viewVars = $this->_View->viewVars;
            $parent = new \stdClass();
            $parent->systemStore = $viewVars['systemStore'];
            $parent->systemCompany = $viewVars['systemCompany'];

            $this->_enum = new Enum();
            $this->_enum->_parent = $parent;
        }

        return $this->_enum->$name;
    }
}
