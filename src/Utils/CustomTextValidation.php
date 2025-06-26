<?php

namespace App\Utils;

use Cake\Validation\Validation;

/**
 * 独自で作成した Validation.
 *
 * @copyright Copyright (c) 2017 EXCEED system. All Rights Reserved.
 * @author    a-miyake
 * @author    i-takahashi
 * @since     2017/10/10  First time this was introduced.
 */
class CustomTextValidation extends Validation
{
    /**
     * 数値(0-9)だけで構築されている文字列かどうかチェックするValidator.
     * 左ゼロパディングされている文字列など、数値としては扱えない文字列の
     * 判断に利用すること.
     *
     * @since 1.0.0 a-miyake  First time this was introduced.
     * @param string $value チェック対象文字列
     * @return bool <true> 数値以外が含まれていない場合
     *              <false> 数値以外が含まれている場合
     */
    public static function containsNonNumeric($value)
    {
        return (bool)preg_match("/^[0-9]+$/", $value);
    }

    /**
     * 半角英字(大小)以外の文字を含んでいないかどうかチェックするValidator.
     * 半角英字(大小)以外の文字を含む場合は false が返る.
     *
     * @since 1.0.0 a-miyake  First time this was introduced.
     * @param string $value チェック対象文字列
     * @return bool <true> 半角英字以外の文字を含まない
     *              <false> 半角英字以外の文字を含む
     */
    public static function containsNonAlphabet($value)
    {
        if (!is_scalar($value)) {
            return false;
        }

        return (bool)preg_match('/^[a-zA-Z]+$/', $value);
    }

    /**
     * 半角英数字以外の文字を含んでいないかどうかチェックするValidator。
     * 半角英数字以外の文字を含む場合は false が返る。
     *
     * @since 1.0.0 a-miyake  First time this was introduced.
     * @param string $value チェック対象文字列
     * @return bool <true> 半角英数字以外の文字を含まない
     *              <false> 半角英数字以外の文字を含む
     */
    public static function containsNonAlphabetAndNumeric($value)
    {
        if (!is_scalar($value)) {
            return false;
        }

        return preg_match_all('/[^a-zA-Z0-9]/', $value) === 0;
    }

    /**
     * 空白文字(半角・全角スペース)以外の文字が含まれている文字列かどうかチェックするValidator.
     * なんらかの文字列(半角・全角スペース以外)が必須の項目に利用する.
     *
     * @since 1.0.0 a-miyake  First time this was introduced.
     * @param string $value チェック対象文字列
     * @return bool <true> 空白文字以外の文字列が存在する場合
     *              <false> 空白文字以外の文字列が存在しない場合
     */
    public static function containsCharacterWithoutWhiteSpace($value)
    {
        return !(bool)preg_match("/^(\s|　)+$/", $value);
    }

    /**
     * サロゲートペア文字(4byte文字)が含まれていないかどうかチェックするValidator.
     * チェック対象文字列の文字コードは UTF-8 であることを想定.
     * チェック対象の文字列を全てチェックする.
     *
     * @since 1.0.0 a-miyake  First time this was introduced.
     * @param string $value チェック対象文字列
     * @return bool <true> サロゲートペアの文字が含まれていない
     *              <false> サロゲートペアの文字列が含まれている
     */
    public static function containsNonSurrogatePairs($value)
    {
        $str = mb_convert_encoding($value, 'UTF-16', 'UTF-8');
        $len = mb_strlen($str, 'UTF-16');

        // 1 文字ずつ調査
        for ($i = 0; $i < $len; $i++) {
            $chars = str_split(bin2hex(mb_substr($str, $i, 1, 'UTF-16')), 4);

            // サロゲートペア文字では無い
            if (count($chars) != 2) {
                continue;
            }
            // サロゲートペア文字である
            return false;
        }
        return true;
    }

    /**
     * 文字列利用可能な場合における「コード」で利用できる文字列以外を含んでいないかどうかチェックするValidator.
     * 半角英大文字・半角英小文字・半角数字と以下記号を許可する.
     * ※ 詳細は Ascii コードの 16進数を参照。
     * !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~
     *
     * @since 1.0.0 a-miyake  First time this was introduced.
     * @param string $value チェック対象文字列
     * @return bool <true> コード利用できる文字以外の文字を含まない
     *              <false> コード利用できる文字以外を含む
     */
    public static function containsNonCharacterCode($value)
    {
        if (!is_scalar($value)) {
            return false;
        }

        return !(bool)preg_match_all('/[^\x21-\x7E]/', $value);
    }

    /**
     * 電話番号に利用できる文字列以外を含んでいないかどうかチェックするValidator.
     * 半角数字と以下記号を許可する.
     *　-（ハイフン）
     *　#（シャープ）
     *　*（アスタリスク）
     *　+（プラス）
     *　( （開き括弧）
     *　) （閉じ括弧）
     * 半角スペース
     *
     * @since 1.0.0 a-miyake  First time this was introduced.
     * @param string $value チェック対象文字列
     * @return bool <true> 電話番号利用できる文字以外の文字を含まない
     *              <false> 電話番号利用できる文字以外を含む
     */
    public static function notContainsPhoneNumber($value)
    {
        if (!is_scalar($value)) {
            return false;
        }

        return preg_match_all('/[^0-9\-\#\*\+\(\)\s]/', $value) === 0;
    }

    /**
     * 16進トリプレット(#FF00FFなど)の表記になっているかを確認する Validator.
     *
     * @param string $value チェック対象文字列
     * @return bool <true>  指定の形式になっている
     *              <false> 指定の形式になっていない
     */
    public static function isHexColor($value)
    {
        return (bool)preg_match(
            '/^#([a-f0-9]{6}|[a-f0-9]{3})\b$/i',
            $value
            );
    }

    /**
     * 帳票の店舗IDのIN句に入れ込むパラメータ
     * @param $value
     * @return bool
     */
    public static
    function storeIdWithComma($value)
    {
        $value = (string)$value;

        if (!preg_match("/^[0-9,]+$/", $value)) {
            return false;  // 空文字と、0-9・カンマ以外のものが入った場合を除外
        }
        if (preg_match("/^,/", $value)) {
            return false;  // 先頭がカンマは除外
        }
        if (preg_match("/,$/", $value)) {
            return false;  // 末尾がカンマは除外
        }
        if (preg_match("/,,/", $value)) {
            return false;  // ２連続のカンマが含まれてたら除外
        }
        return true;
    }

    /**
     * 16進数に使われる値(0-9a-f)と「.」「:」のみになっているかを確認する Validator.
     *
     * @param string $value チェック対象文字列
     * @return bool <true>  指定の形式になっていない
     *              <false> 指定の形式になっている
     */
    public static function checkAcceptableIpAddress($value)
    {
        return (bool)!preg_match(
            '/[^0-9a-f.:]/u',
            $value
            );
    }

    /**
     * 半角英数字以外の文字を含んでいないかどうかチェックするValidator。
     * 半角英数字以外の文字を含む場合は false が返る。
     * 配列用
     *
     * @since 1.0.0 a-miyake  First time this was introduced.
     * @param string $value チェック対象文字列
     * @return bool <true> 半角英数字以外の文字を含まない
     *              <false> 半角英数字以外の文字を含む
     */
    public static function containsNonAlphabetAndNumericArray($value)
    {
        foreach ($value as $row){
            if (!is_scalar($row)) {
                return false;
            }
            if(preg_match_all('/[^a-zA-Z0-9]/', $row) !== 0){
                return false;
            }
        }
        return true;
    }
}