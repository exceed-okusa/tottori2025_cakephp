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
    
    protected $_virtual = [
        'insert_user_name',
        'update_user_name'
    ];

    public function _getInsertUserName()
    {
        if($this->insert_user === null){
            return '';
        }
        return $this->insert_user->family_name . ' ' . $this->insert_user->first_name;
    }
    
    public function _getUpdateUserName()
    {
        if($this->update_user === null){
            return '';
        }
        return $this->update_user->family_name . ' ' . $this->update_user->first_name;
    }
}
