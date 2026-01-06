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

        $isShowSearchArea = false;
        if ($requestData) { // $requestData != []
            $requestData['course_time'] = mb_convert_kana($requestData['course_time'], "n");
            $requestData['number_of_frames'] = mb_convert_kana($requestData['number_of_frames'], "n");
            // 検索条件の表示・非表示の判定
            foreach ($requestData as $value) {
                if ($value != '') {
                    $isShowSearchArea = true;
                    break;
                }
            }
        }

        // 配列からEntityへ変更
        $lectureConditions = $this->Lectures->newEntity($requestData);
        $this->logNotice($lectureConditions);

        $loginUserId = $this->request->session()->read('loginUserId');

        $where = [
            'Lectures.invalidation_flag' => $this->Enum->InvalidationFlag->OFF->value,
            'AreaOfStudies.invalidation_flag' => $this->Enum->InvalidationFlag->OFF->value
        ];

        if ($requestData) {
            if ($requestData['lecture_name'] != '') {
                $where['Lectures.lecture_name LIKE'] = '%' . $requestData['lecture_name'] . '%';
            }
            if ($requestData['area_of_study_name'] != '') {
                $where['AreaOfStudies.area_of_study_name LIKE'] = '%' . $requestData['area_of_study_name'] . '%';
            }
            if (in_array($requestData['class_day'], $this->Enum->DayOfWeek->getValues(), true)) {
                $where['Lectures.class_day'] = $requestData['class_day'];
            }
            if (!empty($requestData['course_time'])) {
                $where['Lectures.course_time'] = $requestData['course_time'];
            }
            if (!empty($requestData['number_of_frames'])) {
                $where['Lectures.number_of_frames'] = $requestData['number_of_frames'];
            }
        }

		$lectures = $this->Lectures->find()
			->contain([
				'AreaOfStudies',
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
		while($number <= 6){
			$courseTimes[] = ['value' => $number, 'text' => ($number .'限')];
			$number++;
		}

        $studyAreaOptions = [];
        $areaOfStudyList = $this->AreaOfStudies->find()
            ->select(['id', 'area_of_study_name'])
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

		$this->set(compact('loginUserId', 'lectureConditions', 'isShowSearchArea'));
        $this->set('lectures', json_encode($lectures));
		$this->set('courseTimes', json_encode($courseTimes));
        $this->set('studyAreaOptions', json_encode($studyAreaOptions));
    }

	public function save()
    {	
        $this->autoRender = false; // Viewを強制的に使わない
        $data = $this->request->input('json_decode', true);

		$ret = [
			'errors' => '',
			'data' => []
		];

        if(!empty($data['editId'])){
            // 編集
            $lecture = $this->Lectures->get($data['editId']);
            $lecture = $this->Lectures->patchEntity($lecture, $data['selectedLecture'], ['associated'=>false]);
        }else{
            // 追加
            $data['selectedLecture']['insert_user_id'] = 0;
            $data['selectedLecture']['update_user_id'] = 0;
            $lecture = $this->Lectures->newEntity($data['selectedLecture'], ['associated'=>false]);
        }

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
        $lecture = $this->Lectures->patchEntity($lecture, $dataForPatch, ['associated'=>false]);
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
