<?php
namespace App\Error;

use App\Controller\AfAppGeneralErrorsController;
use App\Controller\CustomErrorController;
use Cake\Error\ExceptionRenderer;
use Cake\Log\LogTrait;
use Cake\Routing\Router;
use Exception;

/**
 * Class AppExceptionRenderer
 * @package App\Error
 *
 * @property \Cake\Network\Request $request
 */
class AppExceptionRenderer extends ExceptionRenderer
{
    use LogTrait;

    private $request;

    protected function _getController()
    {
        $this->request = Router::getRequest();
        if( $this->isAppAf() ) {
            return new AfAppGeneralErrorsController();
        }
        return new CustomErrorController();
    }

    public function authority($error)
    {
        return $this->_getController()->authorityAction($error);
    }

    protected function _template(Exception $exception, $method, $code)
    {
        if ( $exception instanceof \Cake\Database\Exception ) {
            if( !$this->isWebReserve() || !$this->isAmazonPayCertificationFromPos() ) {  // ネット予約は対象外
                if ( !Router::getRequest()->is('ajax') ) {
                    return $this->_getController()
                                ->redirect(['Controller' => 'Login']);
                }
            }
        }

        $template = 'error500';
        if( $code < 500 ) {
            $template = 'error400';
        }

        if( $this->isWebReserve() ) {
            // ネット予約用のエラーページ
            $template = 'error500_reserve';
        }

        if( $this->isAmazonPayCertificationFromPos() ) {
            // POSからのAmazonPay認証画面用
            $template = 'error500_amazon_pay_certification_from_pos';
            if( $code < 500 ) {
                $template = 'error400_amazon_pay_certification_from_pos';
            }
        }

        if( $this->isAppAf() ) {
            // お客様アプリ用のエラーページ
            $template = 'error500_af_app';
        }

        return $this->template = $template;
    }

    private function isWebReserve()
    {
        return preg_match("/^reserve/", $this->request->url);
    }

    private function isAmazonPayCertificationFromPos()
    {
        return preg_match("/^amazon-pay-certification-from-pos/", $this->request->url);
    }

    private function isAppAf()
    {
        $class = '\App\Controller\\'. $this->request->controller. 'Controller';
        return is_subclass_of($class, '\App\Controller\AfAppBaseController');
    }
}
