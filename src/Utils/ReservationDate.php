<?php

namespace App\Utils;

use Cake\I18n\Date;
use Cake\I18n\FrozenTime;

/**
 * Class ReservationDate
 * @package App\Utils
 * @property FrozenTime targetDate
 * @property FrozenTime $startDatetime
 * @property FrozenTime $endDatetime
 */
class ReservationDate
{
    public $targetDate;
    public $startDatetime;
    public $endDatetime;

    public function __construct($strStartDatetime, $strEndDatetime, $dayStartTime, $min30Flag = false)
    {
        // 時刻の初期値
        $this->startDatetime = new FrozenTime();
        $this->endDatetime = new FrozenTime();
        $this->startDatetime = new FrozenTime($strStartDatetime);
        if ( !empty($strEndDatetime) ) {
            $this->endDatetime = new FrozenTime($strEndDatetime);
        } else {
            $this->endDatetime = new FrozenTime($strStartDatetime);
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
        $this->targetDate = new Date($this->startDatetime);
        if ( !empty($dayStartTime) ) {
            if ( $this->startDatetime->hour < $dayStartTime ) {
                $this->targetDate = $this->targetDate->addDay(-1);
            }
        }
        $this->targetDate = $this->targetDate->hour(0)->minute(0)->second(0);
    }
}