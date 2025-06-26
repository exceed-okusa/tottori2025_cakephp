<?php
namespace Utils\enums\Enum\EnumItem;

use Utils\enums\Enum\Enum;

require_once(ROOT . DS . 'src' . DS . 'Utils' . DS . 'enums' . DS  . 'Enum.php');

/**
 * Class LogLevel
 * @package Utils\enums\Enum\EnumItem
 * @property \Utils\enums\Enum\ItemEnum $WARNING
 * @property \Utils\enums\Enum\ItemEnum $NOTICE
 * @property \Utils\enums\Enum\ItemEnum $ERROR
 * @property \Utils\enums\Enum\ItemEnum $INFO
 * @property \Utils\enums\Enum\ItemEnum $DEBUG
 * @property \Utils\enums\Enum\ItemEnum $SHELL
 * @property \Utils\enums\Enum\ItemEnum $ERROR_SMARTY
 */
Final Class LogLevel extends Enum
{
    public $ERROR;
    public $WARNING;
    public $NOTICE;
    public $INFO;
    public $DEBUG;
    public $SHELL;
    public $ERROR_SMARTY;

    public function __construct(){
        $this->ERROR         = array('value' => 'error',        'text' => 'ERROR',      'description' => "エラー。予期しないその他の実行時エラー。");
        $this->WARNING       = array('value' => 'warning',      'text' => 'WARNING',    'description' => "警告状態。エラー時には同時に参考する。また、「cloud_function テーブルに登録がない機能です。」はこのレベルで出力。");
        $this->NOTICE        = array('value' => 'notice',       'text' => 'NOTICE',     'description' => "正常であるが、エラーに繋がる可能性のある状態。バリデーションエラーなど。");
        $this->INFO          = array('value' => 'info',         'text' => 'INFO',       'description' => "情報。実行時の何らかの注目すべき事象（開始や終了など）。");
        $this->DEBUG         = array('value' => 'debug',        'text' => 'DEBUG',      'description' => "CakePHP の機能で、app.php のDB設定の log を true にすると debug.log にSQLが記録される。※それ以外に使わないこと！！！");
        $this->SHELL         = array('value' => 'shell',        'text' => 'SHELL',      'description' => "シェル実行履歴");
        $this->ERROR_SMARTY  = array('value' => 'err_smarty',   'text' => 'ERR_SMARTY', 'description' => "Smartyで発生したエラー。");
        parent::__construct();
    }
}
