<?php

/* src/View/Helper/LinkHelper.php */
namespace App\View\Helper;

use App\Controller\AppController;
use App\Utils\Traits\SasLogTrait;
use Cake\Core\Configure;
use Cake\View\Helper;

/**
 * Class CommonHelper
 * @package App\View\Helper
 *
 * @property \App\Controller\Component\CommonComponent $CommonComponent
 */
class CommonHelper extends Helper
{
    use SasLogTrait;

    public function __get($name) {
        if ($name === 'CommonComponent') {
            $dummyController = new AppController();
            $dummyController->loadComponent('Common');
            $this->CommonComponent = $dummyController->Common;
            return $this->CommonComponent;
        }

        return parent::__get($name);
    }

    public function iif($condition, $val1, $val2)
    {
        if ( $condition ) {
            return $val1;
        } else {
            return $val2;
        }
    }
    public function eif($val1, $val2)
    {
        return $val1 ?? $val2;
    }

    function json_safe_encode($data){
        return json_encode($data, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
    }

    function js_string($str){
        if(!$str) $str = '';
        $tmp = json_encode($str, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
        preg_match('/^"(.*)"$/',$tmp,$m);
        return $m[1];
    }

    function convertImageSource($imgData) {
        $base64 = base64_encode($imgData);
        $mime = 'image/jpg';
        return 'data:'.$mime.';base64,'.$base64;
    }
    public function nullToZero($val)
    {
        if ( $val == NULL ) {
            return 0;
        } else {
            return $val;
        }
    }

    /**
     * 基本、empty関数と同じだが、0の場合falseを返す。
     *
     * @param $val
     * @return bool
     */
    public function emptyN0(&$val)
    {
        if ( empty($val) && !is_numeric($val) ) {
            return true;
        }

        return false;
    }

    /**
     * Javascriptに日付文字列をセットする際に使用するメソッド<br/>
     * 戻り値にはシングルクォーテーションが付加されます。
     * @param $val
     * @return string
     */
    public function setJSDate(&$val) {
        return (empty($val) ? "''" : "'" . $val->format('Y/m/d') ."'");
    }

    /**
     * Javascriptに時刻文字列をセットする際に使用するメソッド<br/>
     * 戻り値にはシングルクォーテーションが付加されます。
     * @param $val
     * @return string
     */
    public function setJSTime(&$val) {
        return (empty($val) ? "''" : "'" . $val->format('H:i') ."'");
    }

    /**
     * @param      $enum
     * @param      $val
     * @param null $default
     * @return null|string
     */
    public function setJSEnum($enum, &$val, $default=null) {
        if ( key_exists($val, $enum->getValues())) {
            return $val;
        } else {
            if ( is_null($default) ) {
                return 'null';
            } else {
                return $default;
            }
        }
    }

    /**
     * Vue.jsのselectタグで使用する配列を作成するメソッド<br/>
     * @param array     $array          元になる配列
     * @param string    $vModelItem     v-model対象名
     * @param array     $excludeValues  selectタグに出力しない値
     * @return array
     */
    public function getVueSelectArray($array, $vModelItem, $excludeValues=[]) {
        $ret = [];
        foreach ($array as $value => $text) {
            if ( in_array($value, $excludeValues) ) {
                continue;
            }
            $option = [];
            $option['value'] = $value;
            $option['text'] = $text;
            $option['v-model'] = $vModelItem;
            $ret[] = $option;
        }
        return $ret;
    }

    public function getReportMenu($view, $menuList, $hierarchy = -1) {
        $hierarchy++;
        $self = '';
        $child = '';
        foreach ( $menuList as $key => $menu ) {
            if ( $key === 'element' ) {
                if ( !empty($menu['controller']) ) {
                    $rmm = '';
                    if ( !empty($menu['mark']) ) {
                        $rmm = $menu['mark'];
                    }

                    $style = '';
                    if ( $this->request->params['controller'] === $menu['controller'] && $rmm === $this->request->session()->read(Configure::read('Session.rmm')) ||
                        $this->request->session()->read(Configure::read('Session.rmm')) === 'C' && $menu['controller'] === 'ReportCompanyDashboard' ||    // 以下、ダッシュボードの最近利用した帳票メニューからの遷移用
                        $this->request->session()->read(Configure::read('Session.rmm')) === 'S' && $menu['controller'] === 'ReportStoreDashboard'
                    ) {
                        $style = "style=\"background:#17a6c3\" class=\"dataNav_active\" ";
                    }

                    if ( $hierarchy === 1 || $hierarchy >= 3 ) {
                        $self .= "<li>";
                    }

                    $self .= "
                                <a href=\"{$view->Url->build(['controller' => $menu['controller'], 'action' => $menu['action'], '?'=>['rmm'=>$rmm]])}\" {$style}>
                                    <i class=\"ico {$menu['icon']}\"></i>
                                    {$menu['title']}
                                </a>";

                    if ( $hierarchy === 1 || $hierarchy === 3 ) {
                        $self .= "</li>";
                    }
                } else {
                    $self .= "    <li class=\"sidenav_groupTitle\">{$menu['title']}</li>";
                }
            } else {
                $child .= $this->getReportMenu($view, $menu, $hierarchy);
            }
        }

        if ( $hierarchy === 2 ) {
            $self = '<li>'. $self . '<ul class="block_ul menu_list_sub">' . $child . '</ul></li>';
        } else {
            $self = $self . $child;
        }
        return $self;
    }

    /**
     * 配列から指定されたKey項目を削除します。
     * e.g.)
     *    $a = ['aaa' => 0, 'bbb' => 1, 'ccc' => 2]
     *    getUnset($a, ['bbb', 'ccc']);
     *    ---------------------------
     *    $a => ['aaa' => 0]
     *
     * @param array    $array    対象の配列
     * @param array    $removeIndexes 削除したいKey
     * @return string[]   削除後の配列
     */
    public function getUnset($array, $removeIndexes) {
        foreach ( $removeIndexes as $index ) {
            unset($array[$index]);
        }
        return $array;
    }

    /**
     * 渡された配列をJSON文字列に変換した後、base64Encodeするメソッド.
     * encrypt としてはいるが、特に暗号化では無いので、使用は注意です。
     *
     * @see \App\Controller\CustomerEntriesController::edit()
     * @since 1.0.0 i-takahashi  First time this was introduced.
     * @param array $arrayVal
     * @return string
     */
    public function simpleEncryptArrayToJSONString($arrayVal)
    {
        $jsonStringVal = $this->json_safe_encode($arrayVal);

        return urlencode(base64_encode($jsonStringVal));
    }

    /**
     * 渡された配列を  SecurityUtilityを使って配列をJSON文字列にしてそれを暗号化するメソッド
     *
     * @since 1.0.0 i-takahashi  First time this was introduced.
     * @param string $encryptedVal
     * @return array
     */
    public function simpleDecryptJSONStringToArray($encryptedVal)
    {
        /** @var string $base64EncodedString base64でencodeされた文字列. */
        $base64EncodedString = urldecode($encryptedVal);

        /** @var string $paramString パラメータのJSON文字列. */
        $paramString = base64_decode($base64EncodedString);

        /** @var array $paramArray パラメータを配列に変換. */
        $paramArray = json_decode($paramString, true);

        return $paramArray;
    }

    /**
     * param を serialize して URL Encode をかける method.
     *
     * @param array $requestQuery $this->request->query
     * @return string URL Encodeされた文字列
     */
    public function encodeRequestQuery($requestQuery) {
        return $this->CommonComponent->encodeRequestQuery($requestQuery);
    }

    public function decodeRequestQuery($requestQuery) {
        return $this->CommonComponent->decodeRequestQuery($requestQuery);
    }

    public function getUniqueKey() {
        return $this->CommonComponent->getUniqueKey();
    }

    public function getListDayOfWeek($language = null) {
        return $this->CommonComponent->getListDayOfWeek($language);
    }

    public function moneyUnitSign() {
        return $this->CommonComponent->moneyUnitSign();
    }
}