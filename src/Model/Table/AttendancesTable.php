<?php
namespace App\Model\Table;

use Cake\Validation\Validator;

/**
 * Attendances Model
 *
 * @method \App\Model\Entity\Attendance get($primaryKey, $options = [])
 * @method \App\Model\Entity\Attendance newEntity($data = null, array $options = [])
 * @method \App\Model\Entity\Attendance[] newEntities(array $data, array $options = [])
 * @method \App\Model\Entity\Attendance|bool save(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\Attendance patchEntity(\Cake\Datasource\EntityInterface $entity, array $data, array $options = [])
 * @method \App\Model\Entity\Attendance[] patchEntities($entities, array $data, array $options = [])
 * @method \App\Model\Entity\Attendance findOrCreate($search, callable $callback = null)
 */
class AttendancesTable extends BaseTable
{
    /**
     * @param array $config
     * @throws \Exception
     */
    public function initialize(array $config)
    {
        parent::initialize($config);
        $this->displayField('id');
        $this->primaryKey('id');

		$this->belongsTo('Users', [
			'joinType'   => 'LEFT',
			'foreignKey' => 'student_user_id',
		]);

        $this->belongsTo('InsertUser', [
			'className'    => 'Users',
			'foreignKey'   => 'insert_user_id',
            'propertyName' => 'insert_user'
		]);

        $this->belongsTo('UpdateUser', [
			'className'    => 'Users',
			'foreignKey'   => 'update_user_id',
            'propertyName' => 'update_user'
		]);

    }

    /**
     * 学生のユーザーIDで有効なデータを取得する。
     * @param int[] $userIds
     * @param string[] $select
     * @return \App\Model\Entity\Attendance[]
     */
    public function getEffectiveListByStudentUserIds(array $userIds, array $select = [])
    {
        // $userIds = [] のとき困る？
        return $this->find()
                ->select($select)
                ->where([
                    'Attendances.student_user_id IN' => $userIds,
                    'Attendances.invalidation_flag'  => $this->Enum->InvalidationFlag->OFF->value
                ])
                ->toArray();
    }
}
