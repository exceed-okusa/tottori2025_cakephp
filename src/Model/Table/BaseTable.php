<?php

namespace App\Model\Table;

use App\Utils\Enum;
use Aws;
use Cake\Datasource\ConnectionManager;
use Cake\Datasource\EntityInterface;
use Cake\I18n\FrozenTime;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * Class BaseTable
 * @package App\Model\Table
 *
 * @property \Cake\Database\Connection $_connection
 * @property \App\Utils\Enum $Enum
 * @property \App\Model\Entity\User $loginUser
 */
class BaseTable extends Table
{
    protected $Enum;
    protected $loginUser = null;
    public $exceedSpecialOptions = [];

    /**
     * @param array $config
     * @throws \Exception
     */
    public function initialize(array $config)
    {
        parent::initialize($config);

        $this->Enum = new Enum();
        $this->Enum->_parent = $this;

        $this->connection(ConnectionManager::get('default'));

        if (!empty($config['exceedSpecialOptions'])) {
            $this->exceedSpecialOptions = $config['exceedSpecialOptions'];
            $this->loginUser = $this->exceedSpecialOptions['loginUser'];
        }
    }

    public function getDataToCopy($entity)
    {
        $data = $entity->toArray();
        unset($data['id'], $data['insert_date'], $data['insert_user_id'], $data['update_date'], $data['update_user_id']);
        return $data;
    }

    public function save(EntityInterface $entity, $options = [])
    {
        if (!empty($options['userId'])) {
            $this->updateUserId = $options['userId'];
        } else if (!empty($this->loginUser) && $this->loginUser->id === SYSTEM_USER_ID) {
            $this->updateUserId = SYSTEM_USER_ID;
        }
        try {
            $ret = parent::save($entity, $options);
            if (!$ret) {
                throw new \Exception(_mes('XXX', 'システムエラーが発生しました。'));
            }
            return $ret;
        } catch (\Exception $exception) {
            $this->logWarning($entity);
            throw $exception;
        }
    }

    public function saveInvalid($entity)
    {
        if (empty($entity)) {
            return;
        }

        $entity->invalidation_flag = $this->Enum->InvalidationFlag->ON->value;
        $entity->delete_date = new FrozenTime();
        $this->save($entity, ['associated' => false]);
    }

    public function updateAllInvalid($conditions)
    {
        $fields = [
            'update_user_id' => !empty($this->loginUser->id) ? $this->loginUser->id : SYSTEM_USER_ID,
            'update_date' => new FrozenTime(),
            'invalidation_flag' => $this->Enum->InvalidationFlag->ON->value,
            'delete_date' => new FrozenTime(),
        ];
        return parent::updateAll($fields, $conditions);
    }

    public function removeAllAssociations()
    {
        $this->_associations->removeAll();
    }

    public function belongsTo($associated, array $options = [])
    {
        $options['exceedSpecialOptions'] = $this->exceedSpecialOptions;
        return parent::belongsTo($associated, $options);
    }

    public function hasOne($associated, array $options = [])
    {
        $options['exceedSpecialOptions'] = $this->exceedSpecialOptions;
        return parent::hasOne($associated, $options);
    }

    public function hasMany($associated, array $options = [])
    {
        $options['exceedSpecialOptions'] = $this->exceedSpecialOptions;
        return parent::hasMany($associated, $options);
    }

    public function belongsToMany($associated, array $options = [])
    {
        $options['exceedSpecialOptions'] = $this->exceedSpecialOptions;
        return parent::belongsToMany($associated, $options);
    }

    public function association($name)
    {
        $association = parent::association($name);
        if (!empty($association)) {
            $association->exceedSpecialOptions = $this->exceedSpecialOptions;
        }
        return $association;
    }

    public function newEntity($data = null, array $options = [])
    {
        $entity = parent::newEntity($data, $options);
        if (!empty($data)) {
            $this->checkValidationError($entity, $data);
        }
        return $entity;
    }

    public function patchEntity(EntityInterface $entity, array $data, array $options = [])
    {
        $entity = parent::patchEntity($entity, $data, $options);
        $this->checkValidationError($entity, $data);
        return $entity;
    }

    private function checkValidationError(EntityInterface $entity, array $data)
    {
        if (empty($entity->errors())) {
            return;
        }

        $nest = 1;
        $trace = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, $nest + 1);
        $called = $trace[$nest];

        $this->logNotice([
            'called' => substr($called['file'], strlen(ROOT)). '('. $called['line']. ')',
            'errors' => $entity->errors(),
            'data' => $data,
        ]);
    }

    public function checkNotEmpty(Validator $validator, array $checkNotEmpty)
    {
        foreach ($checkNotEmpty as $field => $notEmpty) {
            $validator->requirePresence($field, true, _mes('XXX', 'フォームに項目がありません。'));
            if ($notEmpty) {
                $validator->notEmpty($field, _mes('XXX', '入力必須項目です。'));
            } else {
                $validator->allowEmpty($field);
            }
        }
    }

    public function getKeySortByCode($columnNameCode)
    {
        if (!empty($this->systemCompany->usable_string_code_flag)) {
            return $columnNameCode;
        } else {
            return "CAST({$columnNameCode} AS UNSIGNED)";
        }
    }

    protected function getOrder($defaultOrder, $form)
    {
        $order = [];

        if (!empty($form['sort']) && !empty($form['direction'])) {
            $order[$form['sort']] = $form['direction'];
        }

        foreach ($defaultOrder as $key => $value) {
            if (empty($order[$key])) {
                $order[$key] = $value;
            }
        }

        return $order;
    }

    protected function getDataViewFromArrayQuery($id, $arrayQuery)
    {
        $select = [ $arrayQuery['idFieldName'] ];
        $order = $arrayQuery['order'];
        $contain = $arrayQuery['contain'];
        $where = $arrayQuery['where'];

        $rows = $this->find()->contain($contain)->select($select)->where($where)->order($order)->toList();

        $prePageId = $nextPageId = null;
        $afterMatch = false;
        foreach ($rows as $row) {
            if ($row->id == $id) { $afterMatch = true; continue; }
            if ($afterMatch) { $nextPageId = $row->id; break; }
            $prePageId = $row->id;
        }

        $entity = null;
        if ($afterMatch) {
            $entity = $this->get($id, ['contain'=>$contain]);
        }

        return compact('entity', 'prePageId', 'nextPageId');
    }

    protected function confirmBeforeCsvDownloadArrayQuery($arrayQuery)
    {
        $ret = [];
        $ret['data'] = [
            'messageTooManyRows' => '',
        ];

        $arrayQuery['select'] = [
            'cnt' => 'COUNT(*)'
        ];
        $result = $this->getDataCsvFromArrayQuery($arrayQuery);
        $count = $result[0]['cnt'];
        if ($count > CSV_LIMIT_NUM) {
            $ret['data']['messageTooManyRows'] = _mes('XXX', "件数が多すぎるため、CSV出力できません。");
        }

        return $ret;
    }

    protected function getDataCsvFromArrayQuery($arrayQuery)
    {
        $order = [ $arrayQuery['idFieldName'] => 'ASC' ];
        $contain = $arrayQuery['contain'];
        $where = $arrayQuery['where'];
        $select = !empty($arrayQuery['select']) ? $arrayQuery['select'] : [];

        return $this->find()->select($select)->contain($contain)->where($where)->order($order)->toList();
    }

    protected function formatCsv($items)
    {
        $output = [];

        if (!empty($items[0])) {
            $output[] = array_keys($items[0]);
        }
        foreach ($items as $item) {
            $output[] = array_values($item);
        }

        return $output;
    }

    /**
     * @param $key
     * @return string
     */
    protected function getDataFromS3($key)
    {
        $awsSdkConfig = [
            'region'  => S3_REGION,
            'version' => S3_VERSION,
            'signature_version' => S3_SIGNATURE_VERSION,
            'credentials' => [
                'key'    => S3_CREDENTIALS_KEY,
                'secret' => S3_CREDENTIALS_SECRET,
            ],
        ];
        $sdk = new Aws\Sdk($awsSdkConfig);

        $s3Client = $sdk->createS3();

        $image = '';
        try {
            $obj = $s3Client->getObject(['Bucket' => S3_BUCKET_NAME, 'Key' => $key]);
            $image = ''. $obj['Body'];
        } catch (\Exception $exception) {
            $this->logWarning($this->formatException($exception));
        }

        return $image;
    }
}
