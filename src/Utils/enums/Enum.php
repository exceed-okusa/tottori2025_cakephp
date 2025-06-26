<?php
namespace Utils\enums\Enum;

use Cake\Core\Exception\Exception;
use Cake\Log\LogTrait;

/**
 * Class Enum
 * @package Utils\enums\Enum
 *
 * @property \App\Utils\SystemCompany $_systemCompany
 * @property \App\Utils\SystemStore $_systemStore
 */
Abstract Class Enum {
    use LogTrait;

    public $_systemCompany;
    public $_systemStore;

    protected function _getAttributes()
    {
        $attributes = [];
        foreach (get_object_vars($this) as $key => $value){
            if ($key !== '_systemCompany' && $key !== '_systemStore') {
                $attributes[$key] = $value;
            }
        }
        return $attributes;
    }

    /**
     * Class constructor. Each class attribute is read and
     * transformed into an object ItemEnum
     */
    public function __construct(){
        $attributes = $this->_getAttributes();
        foreach ($attributes as $key => $value){
            require_once(ROOT . DS . 'src' . DS . 'Utils' . DS . 'enums' . DS  . 'ItemEnum.php');
            $this->$key=new \Utils\enums\Enum\ItemEnum($value);
        }
    }

    /**
     * This method controls not try to access a class attribute does not exist
     * @param unknown_type $member
     */
    final function __get($member) {
        if (! isSet($this->$member)){
            throw new Exception('Not exist the enumerator at that attempts to access: ' . $member);
        }
        return $this->$member;
    }

    public function getKeyByValue($findValue){
        $attributes = $this->_getAttributes();
        foreach ($attributes as $key => $attribute){
            if ($attribute->value == $findValue){
                return $key;
            }
        }
        return null;
    }

	public function getTextByValue($findValue){
        $attributes = $this->_getAttributes();
        foreach ($attributes as $attribute){
            if ($attribute->value == $findValue){
                return $attribute->text;
            }
        }
        return null;
    }

    /**
     * This method is used to obtain the itemEnum that has the value equal to the parameter
     *
     * @param undetermined $findValue
     * @return ItemEnum object
     */
    public function getEnumByValue($findValue){
        $attributes = $this->_getAttributes();
        foreach ($attributes as $key => $attribute){
            if ($attribute->value == $findValue){
                return $this->$key;
            }
        }
        return null;
    }

    /**
     * This method is used to obtain the itemEnum that has the text equal to the parameter
     *
     * @param undetermined $findValue
     * @return ItemEnum object
     */
    public function getEnumByText($findText){
        $attributes = $this->_getAttributes();
        foreach ($attributes as $key => $attribute){
            if ($attribute->text == $findText){
                return $this->$key;
            }
        }
        return null;
    }

    /**
     * This method returns an associative array with all values of the enum.
     * The keys of this array are the names of enum attributes
     */
    public function getValues($excludeValues=[]){
        $attributes = $this->_getAttributes();
        $values=array();
        foreach ($attributes as $attribute){
            if ( in_array($attribute->value, $excludeValues) ) {
                continue;
            }
            $values[] = $attribute->value;
        }
        return $values;
    }

    /**
     * This method returns an associative array with all texts of the enum.
     * The keys of this array are the names of enum attributes
     */
    public function getTexts(){
        $attributes = $this->_getAttributes();
        $texts=array();
        foreach ($attributes as $attribute){
            $texts[$attribute->value] = $attribute->text;
        }
        return $texts;
    }

    /**
     * This method returns an associative array with all descriptions of the enum.
     * The keys of this array are the names of enum attributes
     */
    public function getDescriptions(){
        $attributes = $this->_getAttributes();
        $descriptions=array();
        foreach ($attributes as $key => $attribute){
            $descriptions[$key] = $attribute->description;
        }
        return $descriptions;
    }

    /**
     * This method returns an associative array with all values,texts and descriptions of the enum.
     * The keys of this array are the names of enum attributes
     */
    public function getAll(){
        $attributes = $this->_getAttributes();
        return $attributes;
    }

    public function getValuesAndDescriptions(){
        $attributes = $this->_getAttributes();
        $values=array();
        foreach ($attributes as $attribute){
            $values[$attribute->value] = $attribute->description;
        }
        return $values;
    }

    public function getValuesAndTexts($options = []){
        $attributes = $this->_getAttributes();
        $values = [];

        if (!empty($options['only'])) {
            $tmp = [];
            foreach ($options['only'] as $key) {
                $tmp[$key] = $attributes[$key];
            }
            $attributes = $tmp;
        }

        foreach ($attributes as $key => $attribute){
            if (!empty($options['exclude']) && in_array($key, $options['exclude'])) {
                continue;
            }
            $values[$attribute->value] = $attribute->text;
        }

        return $values;
    }

    public function getOptionArray($options = [])
    {
        $attributes = $this->_getAttributes();
        $optionArray = [];

        if (!empty($options['only'])) {
            $tmp = [];
            foreach ($options['only'] as $key) {
                $tmp[$key] = $attributes[$key];
            }
            $attributes = $tmp;
        }

        foreach ($attributes as $key => $attribute){
            if (!empty($options['exclude']) && in_array($key, $options['exclude'])) {
                continue;
            }
            $optionArray[] = [
                'value' => $attribute->value,
                'text'  => $attribute->text,
            ];
        }

        return $optionArray;
    }

    public function getValuesAndTextsForTemplate($excludeValues=[]){
        $attributes = $this->_getAttributes();
        $values = "{";
        foreach ($attributes as $attribute){
            if ( in_array($attribute->value, $excludeValues) ) {
                continue;
            }
            $values .= "'" . $attribute->value . "':'" . addslashes($attribute->text) . "',";
        }
        $values = substr($values, 0, -1);
        $values .= "}";

        return $values;
    }

    public function getSqlCase($case)
    {
        $str = "";
        $str .= "CASE {$case} ";
        $attributes = $this->_getAttributes();
        foreach ($attributes as $attribute){
            $text = $attribute->text;
            $text = str_replace("\\", "\\\\", $text);
            $text = str_replace("'", "\\'", $text);

            $str .= "WHEN {$attribute->value} THEN '{$text}' ";
        }
        $str .= "END";
        return $str;
    }
}
