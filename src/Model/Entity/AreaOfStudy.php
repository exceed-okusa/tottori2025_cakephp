<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * AreaOfStudy Entity
 *
 * @property $id
 * @property $area_of_study_name
 * @property $invalidation_flag
 * @property $delete_date
 * @property $insert_user_id
 * @property $insert_date
 * @property $update_user_id
 * @property $update_date
 */
class AreaOfStudy extends Entity
{
    protected $_accessible = [
        '*' => true,
        'id' => false
    ];
}
