<?php
namespace App\Model\Entity;

use App\Model\Table\LecturesTable;
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
 */
class Lecture extends Entity
{
    protected $_accessible = [
        '*' => true,
        'id' => false
    ];
    // ↓ハイジsqlに書いていないデータを追加するときに使う仮想空間を作成するイメージ
    protected $_virtual = ['class_day_label','insert_user_name','update_user_name'];
                        // ↓上と下を紐づけ                    
    public function _getClassDayLabel(){
            // LecturesTableの一行($this)の中のclass_dayがnullだった時                       // ↓valueをTextに変換class_dayは数字
        if($this->class_day === null){
            // returnに引っかかったらここで終わり
            return '';
        }
        if($this->Enum->DayOfWeek->getTextByValue($this->class_day) == null){
            return '';
        }
        return $this->Enum->DayOfWeek->getTextByValue($this->class_day) . '日';
    }
    public function _getInsertUserName(){
        if($this->insert_user === null){
           return ''; 
        }
        return $this->insert_user->family_name .' '. $this->insert_user->first_name;
    }
    public function _getUpdateUserName(){
        if($this->update_user === null){
           return ''; 
        }
        return $this->update_user->family_name .' '. $this->update_user->first_name;
    }        
}
