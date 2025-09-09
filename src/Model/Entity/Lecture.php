<?php

namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * Lecture Entity
 *
 * @property int    		$id
 * @property string 		$lecture_name
 * @property int 			$class_day
 * @property int 			$course_time
 * @property int 			$area_of_study_id
 * @property int 			$number_of_frames
 * @property int 			$invalidation_flag
 * @property FrozenTime 	$delete_date
 * @property int 			$insert_user_id
 * @property FrozenTime 	$insert_date
 * @property int 			$update_user_id
 * @property FrozenTime 	$update_date
 * 
 * @property string         $class_day_label
 * @property string         $insert_user_name
 * @property string         $update_user_name
 */

class Lecture extends Entity
{
    protected $_accessible = [
        '*' => true,
        'id' => false
    ];

    protected $_virtual = ['class_day_label', 'insert_user_name', 'update_user_name'];

    public function _getClassDayLabel()
    {
        $day = $this->Enum->DayOfWeek->getTextByValue($this->class_day);
        if ($this->class_day === null) {
            //データ入力がnull
            return;
        }
        if ($day == null) {
            //変換するときに、nullになるもの
            return;
        }
        return $day . "日";
    }


    public function _getInsertUserName()
    {
        if ($this->insert_user_id === null) {
            return "";
        }
        if ($this->insert_user == null) {
            return "";
        }
        return $this->insert_user->family_name . $this->insert_user->first_name;
    }

    public function _getUpdateUserName()
    {
        if ($this->update_user_id === null) {
            return "";
        }
        if ($this->update_user == null) {
            return "";
        }
        return $this->update_user->family_name . $this->update_user->first_name;
    }
}
