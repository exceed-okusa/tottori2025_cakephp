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
        $this->displayField('student_user_id');
        $this->primaryKey('student_user_id');
        
        $this->belongsTo('Users', [
            'joinType'   =>  'LEFT',
            'foreignKey' =>  'id',
        ]);
    }
}