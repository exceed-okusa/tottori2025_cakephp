<?php
namespace  Utils\enums\Enum;

use Cake\Core\Exception\Exception;

Class ItemEnum {

    /**
     * @var mix : Value of item enum. Is recommended that it be an integer or a string
     */
    public $value=null;

    /**
     * @var string:  Description of item enum
     */
    public $text=null;

    /**
     * @var string:  Description of item enum
     */
    public $description=null;


    /**
     * Class constructor. This method initializes the class attribute.
     * Then these attributes will no longer be modified
     * @param mixed $value: can be a single value or an array. If an array
     *     is an associative array where the keys should be 'value', 'text' and 'description'.
     * @param string $text: The text of item enum
     * @param string $description: The description of item enum
     */
    public function __construct($value,$text=null,$description=null){
        if (! isSet($value)){
            throw new Exception('The enum must have a value.');
        }

        if (is_array($value)){
            if (! isSet($value['value'])){
                throw new Exception('The enum must have a value.');
            }
            $val=$value['value'];
            if (isSet($value['text'])){
                $text=$value['text'];
            }
            if (isSet($value['description'])){
                $description=$value['description'];
            }
        }
        $this->value=$val;
        $this->text=$text;
        $this->description=$description;
    }

    /**
     * @return mixed return the value of the item
     */
    public function getValue(){
        return $this->value;
    }

    /**
     * @return string return the string of the item
     */
    public function getText(){
        return $this->text;
    }

    /**
     * @return string return the description of the item
     */
    public function getDescription(){
        return $this->description;
    }
}
