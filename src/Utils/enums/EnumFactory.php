<?php

namespace Utils\enums\Enum;



Class EnumFactory{

    private static $instance=null;

    /**
     * Is a private class constructor. So that you can not make a new
     * of this class
     *
     */
    private function __construct(){

    }


    /**
     * To obtain the only instance of this class.
     */
    public static function getInstance(){
        if (self::$instance == null){
            self::$instance=new self;
        }
        return self::$instance;
    }

    /**
     * To prevent the cloning of this class
     * @throws \Exception
     */
    private function __clone() {
        throw new \Exception('Cloning is not allowed');
    }


    /**
     * This method is executed when you attempt to access any attribute of the class.
     * If the attribute is null create a object. This object class name matches the name
     * of the attribute.
     *
     * @param string $member: Attribute name is trying to access
     * @throws \Exception
     */
    final function __get($member) {
        if (empty($member)){
            throw new \Exception('The parameter is empty');
        }

        if (empty($this->$member)){
            if (! class_exists($member)){
                // Try to load the class
                // App::import('Vendor',"enums/enumlist/" . $member);
                require_once(ROOT . DS . 'src' . DS . 'Utils' . DS . 'enums' . DS  . 'enumlist'  . DS . $member . '.php');
                if (! class_exists("\\Utils\\enums\\Enum\\EnumItem\\" . $member)){
                    throw new \Exception('The enum are trying to access It does not exist: ' . $member);
                }
            }

            $enum = "\\Utils\\enums\\Enum\\EnumItem\\" . $member;
            $this->$member= new $enum;
        }
        return $this->$member;
      }
 }
