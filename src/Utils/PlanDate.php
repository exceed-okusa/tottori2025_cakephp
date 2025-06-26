<?php
/**
 * Created by PhpStorm.
 * User: tanabe
 * Date: 2016/11/10
 * Time: 14:45
 */

namespace App\Utils;

use Cake\I18n\Date;
use Cake\I18n\FrozenDate;
use Cake\I18n\FrozenTime;
use Cake\I18n\Time;
use function GuzzleHttp\Psr7\str;
use phpDocumentor\Reflection\Types\Integer;

/**
 * Class PlanDate
 * @package App\Utils
 */
class PlanDate
{

    /** @var Time $targetDate */
    public $targetDate;
    /** @var Time $startDatetime */
    public $startDatetime;
    /** @var Time $endDatetime */
    public $endDatetime;

    public function __construct($strStartDatetime, $strEndDatetime, $dayStartTime, $min30Flag = false)
    {

        // 時刻の初期値
        $this->startDatetime = FrozenTime::parseDateTime($strStartDatetime, 'yyyy-MM-dd HH:mm:ss');
        $this->endDatetime = FrozenTime::parseDateTime($strStartDatetime, 'yyyy-MM-dd HH:mm:ss');
        if ( !empty($strEndDatetime) ) {
            $this->endDatetime = FrozenTime::parseDateTime($strEndDatetime, 'yyyy-MM-dd HH:mm:ss');
        }

        if ( $this->endDatetime < $this->startDatetime ) {
            $this->endDatetime = $this->endDatetime->addDay(1);
        }

        $diff = $this->startDatetime->diff($this->endDatetime);
        if ( $min30Flag && $diff->m == 0 && $diff->d == 0 && $diff->h == 0 && $diff->i < 30 ) {
            // 終了時刻は最低開始から30分後
            $this->endDatetime = new FrozenTime($this->startDatetime);
            $this->endDatetime = $this->endDatetime->addMinutes(30);
        }

        // 対象日付を開始時刻から設定します。
        $this->targetDate = new FrozenDate($this->startDatetime->format('Y-m-d'));
        if ( intval($this->startDatetime->format('G')) < $dayStartTime ) {
            $this->targetDate = $this->targetDate->addDays(-1);
        }

    }

}