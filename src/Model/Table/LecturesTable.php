<?php
namespace App\Model\Table;

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

		$this->belongsTo('AreaOfStudies', [
			'joinType'   => 'LEFT',
			'foreignKey' => 'area_of_study_id',
		]);
    }
}
