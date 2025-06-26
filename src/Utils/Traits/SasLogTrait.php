<?php
/**
 * CakePHP(tm) : Rapid Development Framework (http://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 * @link          http://cakephp.org CakePHP(tm) Project
 * @since         3.0.0
 * @license       http://www.opensource.org/licenses/mit-license.php MIT License
 */
namespace App\Utils\Traits;

use Cake\Log\LogTrait;
use Utils\enums\Enum\EnumItem\LogLevel;

/**
 * A trait providing an object short-cut method
 * to logging.
 */
trait SasLogTrait
{
    use LogTrait;

    /**
     * @param $value
     * @return mixed|string
     */
    private function formatMessage($value)
    {
        if (gettype($value) === 'boolean') {
            $message = $value ? 'true' : 'false';
        } else {
            $message = print_r($value, true);
        }
        return $message;
    }

    /**
     * @param \Exception $exception
     * @return string
     */
    public function formatException($exception)
    {
        $message = $exception->getMessage();
        $message .= "\r\n". $exception->getFile(). '('. $exception->getLine(). ')';
        $message .= "\r\n\r\n". $exception->getTraceAsString();

        return $message;
    }

    private function addFileLine($msg, $nest)
    {
        $called = debug_backtrace()[$nest+1];
        return substr($called['file'], strlen(ROOT)). '('. $called['line']. ') '. $msg;
    }

    public function logInfo($msg, $nest = 0, $context = [])
    {
        $msg = $this->formatMessage($msg);
        $msg = $this->addFileLine($msg, $nest);
        /** @var LogLevel $enumLogLevel */
        $enumLogLevel = enums()->LogLevel;
        return $this->log($msg, $enumLogLevel->INFO->value, $context);
    }

    public function logWarning($msg, $nest = 0)
    {
        $msg = $this->formatMessage($msg);
        $msg = $this->addFileLine($msg, $nest);
        /** @var LogLevel $enumLogLevel */
        $enumLogLevel = enums()->LogLevel;
        return $this->log($msg, $enumLogLevel->WARNING->value);
    }

    public function logWarningVariable($keyValue = [], $nest = 0)
    {
        $message = '';
        foreach ($keyValue as $key => $value) {
            $type = gettype($value);
            $message .= "\r\n". '$'. $key. ': ('. $type. ') ';
            $message .= $this->formatMessage($value);
        }
        $this->logWarning($message, $nest+1);
    }

    /**
     * @param \Exception $exception
     * @param int $nest
     */
    public function logWarningException($exception, $nest = 0)
    {
        $message = $exception->getMessage();
        $message .= "\r\n". $exception->getFile(). '('. $exception->getLine(). ')';
        $message .= "\r\n\r\n". $exception->getTraceAsString();

        $this->logWarning($message, $nest+1);
    }

    public function logNotice($msg, $nest = 0)
    {
        $msg = $this->formatMessage($msg);
        $msg = $this->addFileLine($msg, $nest);
        /** @var LogLevel $enumLogLevel */
        $enumLogLevel = enums()->LogLevel;
        return $this->log($msg, $enumLogLevel->NOTICE->value);
    }

    public function logNoticeVariable($keyValue = [], $nest = 0)
    {
        $message = '';
        foreach ($keyValue as $key => $value) {
            $type = gettype($value);
            $message .= "\r\n". '$'. $key. ': ('. $type. ') ';
            $message .= $this->formatMessage($value);
        }
        $this->logNotice($message, $nest+1);
    }

    public function logShell($msg, $nest = 0)
    {
        $msg = $this->formatMessage($msg);
        $msg = $this->addFileLine($msg, $nest);
        /** @var LogLevel $enumLogLevel */
        $enumLogLevel = enums()->LogLevel;
        return $this->log($msg, $enumLogLevel->SHELL->value);
    }

    public function logSmarty($msg, $nest = 0)
    {
        $msg = $this->formatMessage($msg);
        $msg = $this->addFileLine($msg, $nest);
        /** @var LogLevel $enumLogLevel */
        $enumLogLevel = enums()->LogLevel;
        return $this->log($msg, $enumLogLevel->ERROR_SMARTY->value);
    }
}
