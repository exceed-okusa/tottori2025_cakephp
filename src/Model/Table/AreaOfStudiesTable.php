<?php
namespace App\Model\Table;

use Cake\Validation\Validator;

/**
 * AreaOfStudies Model
 *
 * @method \App\Model\Entity\AreaOfStudy get($primaryKey, $options = [])
 * @method \App\Model\Entity\AreaOfStudy newEntity($data = null, array $options = [])
 * @method \App\Model\Entity\AreaOfStudy[] newEntities(array $data, array $options = [])
 * @method \App\Model\Entity\AreaOfStudy|bool save(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\AreaOfStudy patchEntity(\Cake\Datasource\EntityInterface $entity, array $data, array $options = [])
 * @method \App\Model\Entity\AreaOfStudy[] patchEntities($entities, array $data, array $options = [])
 * @method \App\Model\Entity\AreaOfStudy findOrCreate($search, callable $callback = null)
 */
class AreaOfStudiesTable extends BaseTable
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

    }
}
