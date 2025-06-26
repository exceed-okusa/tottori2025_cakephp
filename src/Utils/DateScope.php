<?php
namespace App\Utils;

use Cake\I18n\FrozenDate;

/**
 * Class DateScope
 * @package App\Utils
 *
 * @property FrozenDate $from
 * @property FrozenDate $to
 */
class DateScope
{
    /**
     * DateScope constructor.
     * @param \App\Controller\BaseController $controller
     * @param array $options
     * @throws \Exception
     */
    public function __construct($controller, $options = [])
    {
        if(empty($controller->targetStoreId)) {
            $closingDay = $controller->Companies->get($controller->targetCompanyId)->sales_closing_day;  // 企業版
        } else {
            $closingDay = $controller->Stores->get($controller->targetStoreId)->sales_closing_day;  // 店舗版
        }

        if ($closingDay >= 29) {
            $closingDay = 31;  // 29 以上の値が入っていたら、月末締めとして扱う。
        }

        if (!empty($options['targetDate'])) {
            $targetDate = new FrozenDate($options['targetDate']);
        } else {
            $targetDate = $controller->targetDate;
        }

        $thisMonth = new FrozenDate($targetDate->format('Y-m-') . '01');
        if (intval($targetDate->format('d')) <= $closingDay) {
            $lastTerm = $thisMonth->sub(new \DateInterval('P1M'));

            $preClosingDate = new FrozenDate($lastTerm->format('Y-m-') . $closingDay);
            if ($preClosingDate->format('m') !== $lastTerm->format('m')) {
                $preClosingDate = ( new FrozenDate($thisMonth->format('Y-m-') . '01') )
                    ->sub(new \DateInterval('P1D'));  // 月末補正
            }

            $dateTo = new FrozenDate($thisMonth->format('Y-m-') . $closingDay);
            if ($dateTo->format('m') !== $thisMonth->format('m')) {
                $dateTo = (new FrozenDate($thisMonth->format('Y-m-') . '01'))
                    ->add(new \DateInterval('P1M'))
                    ->sub(new \DateInterval('P1D'));  // 月末補正
            }
        } else {
            $nextTerm = $thisMonth->add(new \DateInterval('P1M'));

            $preClosingDate = new FrozenDate($thisMonth->format('Y-m-') . $closingDay);
            $dateTo = new FrozenDate($nextTerm->format('Y-m-') . $closingDay);
        }

        $this->from = $preClosingDate->add(new \DateInterval('P1D'));
        $this->to = $dateTo;
    }
}
