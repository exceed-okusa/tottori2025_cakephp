<?php

namespace App\Utils;

/**
 * Class MailReplaceBody
 * @package App\Utils
 *
 * @property string $name
 * @property string $birth
 * @property string $eDay
 * @property string $fDay
 * @property string $reservationDay
 * @property string $reservationTime
 * @property string $storeName
 * @property string $companyName
 * @property string $address
 * @property string $phoneNumber
 * @property string $faxNumber
 * @property string $homepage
 * @property string $email
 * @property string $point
 * @property string $couponUrl
 * @property string $couponQr
 */
class MailReplaceBody
{
    public $name = '';
    public $birth = '';
    public $eDay = '';
    public $fDay = '';
    public $reservationDay = '';
    public $reservationTime = '';
    public $storeName = '';
    public $companyName = '';
    public $address = '';
    public $phoneNumber = '';
    public $faxNumber = '';
    public $homepage = '';
    public $email = '';
    public $point = '';
    public $couponUrl = '';
    public $couponQr = '';

    private $body = '';

    function __construct($body)
    {
        $this->body = $body;
    }

    public function replaceBody()
    {

        $this->body = str_replace('%name%', $this->name, $this->body);
        $this->body = str_replace('%birth%', $this->birth, $this->body);
        $this->body = str_replace('%eday%', $this->eDay, $this->body);
        $this->body = str_replace('%fday%', $this->fDay, $this->body);
        $this->body = str_replace('%reservationday%', $this->reservationDay, $this->body);
        $this->body = str_replace('%reservationtime%', $this->reservationTime, $this->body);
        $this->body = str_replace('%store_name%', $this->storeName, $this->body);
        $this->body = str_replace('%company_name%', $this->companyName, $this->body);
        $this->body = str_replace('%address%', $this->address, $this->body);
        $this->body = str_replace('%phone_number%', $this->phoneNumber, $this->body);
        $this->body = str_replace('%fax_number%', $this->faxNumber, $this->body);
        $this->body = str_replace('%homepage%', $this->homepage, $this->body);
        $this->body = str_replace('%email%', $this->email, $this->body);
        $this->body = str_replace('%point%', $this->point, $this->body);
        $this->body = str_replace('%coupon%', $this->couponUrl, $this->body);
        $this->body = str_replace('%qr%', $this->couponQr, $this->body);

        return $this->body;
    }
}
