<?php
namespace App\Utils;

/**
 * Class LogForApnsPHP
 * @package App\Utils
 *
 * @property \stdClass $stdClassForLog
 */
class LogForApnsPHP implements \ApnsPHP_Log_Interface
{
    private $_component;
    public $stdClassForLog = null;

    /**
     * LogForApnsPHP constructor.
     * @param \App\Controller\Component\BaseComponent $component
     */
    public function __construct($component)
    {
        $this->_component = $component;
    }

    public function log($message)
    {
        if (!empty($this->_component->shell)) {
            $this->_component->shell->out($message);
        }
        if (!empty($this->stdClassForLog)) {
            $this->stdClassForLog->message .= $message. "\r\n";
        }
    }
}
