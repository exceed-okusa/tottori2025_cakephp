<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * Attendance Entity
 *
 * @property int            $id
 * @property int            $student_user_id
 * @property int            $lecture_id
 * @property int            $attendance_status
 * @property int            $semester
 * @property int            $lecture_number
 * @property int            $insert_user_id
 * @property FrozenTime     $insert_date
 * @property int            $update_user_id
 * @property FrozenTime     $update_date
 * @property int            $invalidation_flag
 * @property FrozenTime     $delete_date
 * 
 * @property string         $insert_user_name
 * @property string         $update_user_name
 */
class Attendance extends Entity
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
