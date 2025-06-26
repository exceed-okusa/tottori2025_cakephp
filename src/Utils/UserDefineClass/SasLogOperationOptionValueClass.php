<?php

namespace App\Utils\UserDefineClass;

/**
 * LogOperation に ログ出力時に使用する為のオプション値データ管理 Class.
 *
 * @copyright Copyright (c) 2018 EXCEED system. All Rights Reserved.
 * @author    i-takahashi
 * @since     1.0.0 2018/01/12  First time this was introduced.
 * @version   1.0.0 2018/01/12
 */
class SasLogOperationOptionValueClass
{
    private $userEntity    = null;
    private $userId        = null;
    private $headCompanyId = null;
    private $companyId     = null;
    private $storeId       = null;

    /**
     * SasLogOperationOptionValueClass 's Constructor.
     *
     * @param \App\Model\Entity\User|null $userEntity
     * @param int|null                    $targetHeadCompanyId
     * @param int|null                    $targetCompanyId
     * @param int|null                    $targetStoreId
     */
    function __construct($userEntity = null, $targetHeadCompanyId = null, $targetCompanyId = null, $targetStoreId = null)
    {
        if (!empty($userEntity)) {
            $this->userEntity = $userEntity;
            if ($userEntity instanceof \App\Model\Entity\User) {
                $this->userId = $userEntity->id;
            }
        }

        if ($targetHeadCompanyId !== null) {
            $this->headCompanyId = $targetHeadCompanyId;
        }

        if ($targetCompanyId !== null) {
            $this->companyId = $targetCompanyId;
        }

        if ($targetStoreId !== null) {
            $this->storeId = $targetStoreId;
        }
    }

    /**
     * LogOperation->newEntity() 加工用にプロパティを配列にして返すメソッド.
     *
     * @since 1.0.0 i-takahashi  First time this was introduced.
     * @return array
     */
    public function getValuesArray()
    {
        $values = [];

        if ($this->userEntity instanceof \App\Model\Entity\User) {
            foreach ($this->userEntity->toArray() as $key => $value) {
                if ($key === 'id') {
                    $values['user_id'] = $value;
                } else {
                    $values[$key] = $value;
                }
            }
        }

        if ($this->headCompanyId !== null) {
            $values['head_company_id'] = $this->headCompanyId;
        }

        if ($this->companyId !== null) {
            $values['company_id'] = $this->companyId;
        }

        if ($this->storeId !== null) {
            $values['store_id'] = $this->storeId;
        }

        return $values;
    }

}