<?php

namespace App\Exception;

use Cake\Core\Configure;
use Cake\Core\Exception\Exception;

/**
 * Created by PhpStorm.
 * User: user
 * Date: 2016/04/22
 * Time: 16:20
 */
class AuthorityException extends Exception
{
    public function __construct($message = '', $code = 406, $previous = null)
    {
        if ( empty($message) ) {
            $message = Configure::read('CLOUD_MESSAGES.BA00101_5');
        }

        if (is_array($message)) {
            $this->_attributes = $message;
            $message = vsprintf($this->_messageTemplate, $message);
        }
        parent::__construct($message, $code, $previous);
    }
}