<?php

namespace App\Controller;

use Cake\Controller\Controller;
use Cake\I18n\FrozenTime;


/**
 * Class LecturesController
 * @package App\Controller
 */
class LecturesController extends BaseController
{
    public function index()
    {
        $requestData = $this->request->query;
        $this->logNotice($requestData);
        // 配列の中にキーがあるかを確認する
        $isShowSearchArea = false;
        if(array_key_exists('course_time',$requestData)){
            // if($requestData['course_time'] != ''){
            //     $isShowSearchArea = true;
            // }
            // if($requestData['number_of_frames'] != ''){
            //     $isShowSearchArea = true;
            // }
            // if($requestData['area_of_study_name'] != ''){
            //     $isShowSearchArea = true;
            // }
            // $requestDatas = [
            //             'course_time' => ''

            // ];
            foreach ($requestData as $value) {
                if ($value != '') {
                    $isShowSearchArea = true;
                    break;
                }
            }
                
            // foreach($requestDatas as $key => $requestData){
            //     $requestDatas 
            // }
            $requestData['course_time'] = mb_convert_kana($requestData['course_time'],"n");
        }
        if(array_key_exists('number_of_frames',$requestData)){
            $requestData['number_of_frames'] = mb_convert_kana($requestData['number_of_frames'],"n");
        }
        
        
        
        
        // 配列からEntityへ変更

        $lectureConditions = $this->Lectures->newEntity($requestData);
        $this->logNotice($lectureConditions);
        

        $this->logNotice($this->request->session()->read());

        $loginUserId = $this->request->session()->read('loginUserId');

        $where = [
                'Lectures.invalidation_flag' => $this->Enum->InvalidationFlag->OFF->value,
                'AreaOfStudies.invalidation_flag' => $this->Enum->InvalidationFlag->OFF->value
        ];

        if($requestData) {
            if($requestData['lecture_name'] != '') {
                $where['Lectures.lecture_name LIKE'] = '%' . $requestData['lecture_name'] . '%';
            }
            if($requestData['area_of_study_name'] != '') {
                $where['AreaOfStudies.area_of_study_name LIKE'] = '%' . $requestData['area_of_study_name'] . '%';
            }
            if(in_array($requestData['class_day'], $this->Enum->DayOfWeek->getValues(), true)) {
                $where['Lectures.class_day'] = $requestData['class_day'];
            }
            if(!empty($requestData['course_time'])) {
                $where['Lectures.course_time'] = $requestData['course_time'];
            }
            if(!empty($requestData['number_of_frames'])) {
                $where['Lectures.number_of_frames'] = $requestData['number_of_frames'];
            }
        }
        

		$lectures = $this->Lectures->find()
			->contain([
				'AreaOfStudies',
                // 'Users'
                'InsertUser',
                'UpdateUser',
			])
            ->where($where)
			->order([
				'Lectures.id' => 'ASC'
			])
			->toArray();

		$courseTimes = [];
		$number = 1;
		while($number <= 6){  // $number <= 6 numberが6以下
			$courseTimes[] = ['value' => $number, 'text' => ($number .'限')];
			$number++;
		}
        
        $studyAreaOptions = [];
        $areaOfStudyList = $this->AreaOfStudies->find()
            ->select(['id','area_of_study_name'])
            ->where([
                'invalidation_flag' => $this->Enum->InvalidationFlag->OFF->value
            ])
            ->toArray();

        foreach ($areaOfStudyList as $areaOfStudy) {
            $studyAreaOptions[] = [
                'value' => $areaOfStudy->id,
                'text'  => $areaOfStudy->area_of_study_name,
            ];
        }        
            // $studyAreaOptions = array_column($areaOfStudySubject, 'area_of_study_name');

        // $this->set('loginUserId',$loginUserId);
        $this->set(compact('loginUserId','lectureConditions'));
		$this->set('lectures', json_encode($lectures));
		$this->set('courseTimes', json_encode($courseTimes));
        $this->set('studyAreaOptions', json_encode($studyAreaOptions));
        $this->set(compact('isShowSearchArea'));
    }

	public function save()
    {
		// 未実装		
        $this->autoRender = false; // Viewを強制的に使わない
        $data = $this->request->input('json_decode', true);

		$ret = [
			'errors' => '',
			'data' => [
				'user' => null,
				'status' => '',
				'message' => '',
                
			]
		];
        $areaOfStudyIds = [];
        $areaOfStudyList = $this->AreaOfStudies->find()
            ->select([
                'id'
            ])
            ->where([
                'AreaOfStudies.invalidation_flag' => $this->Enum->InvalidationFlag->OFF->value
            ])
            ->toArray();
            foreach($areaOfStudyList as $areaOfStudy){
                $areaOfStudyIds[] = $areaOfStudy['id'];
            }
        $this->logNotice($areaOfStudyList);
        $this->logNotice($areaOfStudyIds);

        
        // $data['selectedLecture']['area_of_study_id']がどうやって思いつくのか
        // $dataの中身をlogNoticeに入れて調べてみる

        if(!empty($data['editId'])){
            // 編集
            $lecture = $this->Lectures->get($data['editId']);
            $lecture = $this->Lectures->patchEntity($lecture,$data['selectedLecture'],['associated'=>false]);
        }else{
            // 追加
            $data['selectedLecture']['insert_user_id'] = 0;
            $data['selectedLecture']['update_user_id'] = 0;
            $data['selectedLecture']['insert_date'] = new FrozenTime();
            $data['selectedLecture']['update_date'] = new FrozenTime();

            $this->logNotice($data['selectedLecture']);
            $lecture = $this->Lectures->newEntity($data['selectedLecture'],['associated'=>false]);

        }
        // 
        
        // $this->logNotice($lecture);
        
        
        // $this->logNotice($lecture);
        // $this->Lectures->delete($lecture);
        
		$this->Lectures->save($lecture);

        $this->set([
            'dataFromAjax' => $ret['data'],
			'errors' => $ret['errors'],
            '_serialize' => ['response']
        ]);
		// JSONヘッダーをセット
		$this->response->type('json');
		// JSON文字列を本文にセット
		$this->response->body(json_encode($ret));

		return $this->response;
		
    }

    public function delete()
    {
		// 未実装		
        $this->autoRender = false; // Viewを強制的に使わない
        $data = $this->request->input('json_decode', true);

		$ret = [
			'errors' => '',
			'data' => []
		];

        $dataForPatch = [
            'invalidation_flag' => $this->Enum->InvalidationFlag->ON->value,
            'delete_date'       => new FrozenTime()
        ];
        $lecture = $this->Lectures->get($data['editId']);
        // $this->logNotice($lecture);
        $lecture = $this->Lectures->patchEntity($lecture,['invalidation_flag'=>$this->Enum->InvalidationFlag->ON->value],['associated'=>false]);
        // $this->logNotice($lecture);
        // $this->Lectures->delete($lecture);
        $this->Lectures->save($lecture);
		

        $this->set([
            'dataFromAjax' => $ret['data'],
			'errors' => $ret['errors'],
            '_serialize' => ['response']
        ]);
		// JSONヘッダーをセット
		$this->response->type('json');
		// JSON文字列を本文にセット
		$this->response->body(json_encode($ret));

		return $this->response;
		
    }

}

