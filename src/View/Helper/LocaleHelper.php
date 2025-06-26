<?php

    /* src/View/Helper/LinkHelper.php */
    namespace App\View\Helper;

    use Cake\I18n\FrozenDate;
    use Cake\View\Helper;

    class LocaleHelper extends Helper
    {
        /**
         * MoneyUnitSign
         * @return string
         */
        public function mus($languageCode)
        {
            $ret = "&yen;";
            if ( !empty($languageCode) ) {
                switch ( $languageCode ) {
                    case 'en':
                        $ret = "$";
                        break;
                }
            }
            return $ret;
        }
        public function musInJs($languageCode)
        {
            $ret = "\\\\";
            if ( !empty($languageCode) ) {
                switch ( $languageCode ) {
                    case 'en':
                        $ret = "$";
                        break;
                }
            }
            return $ret;
        }
        /**
         * MoneyUnitSign
         * @return string
         */
        public function dayFormat($languageCode, string $date)
        {
            $weekday = ["日", "月", "火", "水", "木", "金", "土" ];
            if ( !empty($languageCode) ) {
                switch ( $languageCode ) {
                    case 'en':
                        $weekday = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
                        break;
                }
            }
            $dateO = new FrozenDate($date);
            $w = getdate($dateO->getTimestamp());
            return $dateO->format('Y/m/d') . '（' . $weekday[$w['wday']] . '）';

        }
        // 分
        public function minute($languageCode)
        {
            $ret = "分";
            if ( !empty($languageCode) ) {
                switch ( $languageCode ) {
                    case 'en':
                        $ret = "min";
                        break;
                }
            }
            return $ret;
        }
    }