<?php

namespace App\Utils;

use Cake\Datasource\ConnectionManager;

/**
 * Class SystemCompany
 * @package App\Utils
 *
 * @property \Cake\Database\Connection $_connectionDefault
 */
class BaseConnection
{
    private $_connectionDefault;

    /**
     * BaseConnection constructor.
     * @param \App\Controller\BaseController $controller
     */
    public function __construct($controller)
    {
        $this->_connectionDefault = ConnectionManager::get('default');
    }

    public function config()
    {
        return $this->_connectionDefault->config();
    }

    /**
     * @param string $sql The SQL query to execute.
     * @return \Cake\Database\StatementInterface
     */
    public function query($sql)
    {
        return $this->_connectionDefault->query($sql);
    }

    public function setMysqlValueWaitSeconds($second)
    {
        $this->_connectionDefault->query("SET @@session.wait_timeout={$second}");
        $this->_connectionDefault->query("SET @@session.interactive_timeout={$second}");
    }

    /**
     * @param string|\Cake\Database\Query $sql The SQL to convert into a prepared statement.
     * @return \Cake\Database\Statement\StatementDecorator
     */
    public function prepare($sql)
    {
        return $this->_connectionDefault->prepare($sql);
    }

    /**
     * @return bool
     */
    public function connect()
    {
        return $this->_connectionDefault->connect();
    }

    public function disconnect()
    {
        $this->_connectionDefault->disconnect();
    }

    /**
     * @return bool
     */
    public function inTransaction()
    {
        return $this->_connectionDefault->inTransaction();
    }

    /**
     * @param callable $callback
     * @throws \Exception
     */
    public function transactional(callable $callback)
    {
        $this->_connectionDefault->transactional($callback);
    }

    public function begin()
    {
        $this->_connectionDefault->begin();
    }

    public function rollback()
    {
        $this->_connectionDefault->rollback();
    }

    public function commit()
    {
        $this->_connectionDefault->commit();
    }
}
