<?php
namespace App\Model\Table;

use Cake\Database\Query;
use Cake\Validation\Validator;

/**
 * Lectures Model
 *
 * @method \App\Model\Entity\Lecture get($primaryKey, $options = [])
 * @method \App\Model\Entity\Lecture newEntity($data = null, array $options = [])
 * @method \App\Model\Entity\Lecture[] newEntities(array $data, array $options = [])
 * @method \App\Model\Entity\Lecture|bool save(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\Lecture patchEntity(\Cake\Datasource\EntityInterface $entity, array $data, array $options = [])
 * @method \App\Model\Entity\Lecture[] patchEntities($entities, array $data, array $options = [])
 * @method \App\Model\Entity\Lecture findOrCreate($search, callable $callback = null)
 */
class LecturesTable extends BaseTable
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

        // 多 対 1
		$this->belongsTo('AreaOfStudies', [
			'joinType'   => 'LEFT',
            // 'bindingKey' => 'id',  
			'foreignKey' => 'area_of_study_id',
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
     * 講座・学問分類を結合させ、有効なデータを取得する。
     * @param array $select
     * @return \App\Model\Entity\Lecture[]
     */
    public function getEffectiveList(array $select = [])
    {
        return $this->find()
			->contain([
				'AreaOfStudies',
			])
            ->select($select)
            ->where([
                'Lectures.invalidation_flag'      => $this->Enum->InvalidationFlag->OFF->value,
                'AreaOfStudies.invalidation_flag' => $this->Enum->InvalidationFlag->OFF->value
            ])
			->order([
				'Lectures.id' => 'ASC'
            ])
            ->toArray();
    }
}
