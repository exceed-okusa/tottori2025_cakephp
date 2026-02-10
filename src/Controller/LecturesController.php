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

        // 初期表示（クリア）・検索・テストボタン
        // 初期表示：「/lectures」まで
        // 検索：lecture_name,course_timeなどがある
        // テスト：sortが存在する
        $isInitial = empty($requestData);
        $isSearch = false;
        $isTest = false;
        if (!$isInitial) {
            $isTest   =  array_key_exists('sort', $requestData);
            $isSearch = !array_key_exists('sort', $requestData);
        }

        $isShowSearchArea = false;
        if ($isSearch) { // $requestData != []
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

        if ($isSearch) {
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

        $order = [
            'Lectures.id' => 'ASC',
        ];
        if ($isTest) {
            $column = '';
            switch ($requestData['sort']) {
                case 'lecture_id':
                    $column = 'Lectures.id';
                    break;
                case 'lecture_name':
                    $column = 'Lectures.lecture_name';
                    break;
                case 'study_area_name':
                    $column = 'AreaOfStudies.area_of_study_name';
                    break;
            }

            $order = [
                $column => $requestData['direction'],
            ];
        }

		$lectures = $this->Lectures->find()
			->contain([
				'AreaOfStudies',
                'InsertUser',
                'UpdateUser',
			])
            ->where($where) 
			->order($order)
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

        // ▲の向き・位置を決める
        $isOrderAsc = true;
        $hasOrderColumn = 'lecture_id';
        // $requestData['direction'] :ASC なら true / DESC なら false
        if ($isTest) {
            if ($requestData['direction'] == 'DESC') {
                $isOrderAsc = false;
            }
            $hasOrderColumn = $requestData['sort'];
        }

        $this->set(compact('isOrderAsc', 'hasOrderColumn'));
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
