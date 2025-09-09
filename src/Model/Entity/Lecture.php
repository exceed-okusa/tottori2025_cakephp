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
// データベース（SQL）にないカラムを付け足す
    protected $_virtual = ['class_day_label','insert_user_name','update_user_name'];

// _ phpが用意している関数
// _getClassDayLabel 上と紐づける
// $thisは一行のこと
    public function _getClassDayLabel(){
        // $this lecturesテーブルの一個のデータのことでそこのclass_dayがnullだったら
        if($this->class_day == null) {
            return '';
        }
        if($this->Enum->DayOfWeek->getTextByValue($this->class_day) == null) {
            return '';
        }
// returnが来ると処理が終わってしまうからまたreturnを書く
        return $this->Enum->DayOfWeek->getTextByValue($this->class_day) . '日';
    //     if(class_day = null) {
    //         return " "
    //     }elseif(class_day = 8) {
    //         return " ";
    //     }
    // }
    }
    public function _getInsertUserName(){
        if($this->insert_user == null) {
            return "";
        }
        return $this->insert_user->family_name .' '. $this->insert_user->first_name;
        
    }
    public function _getUpdateUserName(){
        if($this->update_user == null){
            return '';
        }
        return $this->update_user->family_name .' '. $this->update_user->first_name;
    }
    
}