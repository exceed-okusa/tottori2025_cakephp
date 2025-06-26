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
 */
class Lecture extends Entity
{
    protected $_accessible = [
        '*' => true,
        'id' => false
    ];
}
