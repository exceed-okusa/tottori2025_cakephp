<?php

namespace App\Controller;

use App\Utils\Enum;
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
        // str=文字列
        // ↓検索ボタンを押したときに検索欄に記入された配列
        $requestData = $this->request->query;
        $this->logNotice($requestData);

        $isShowSearchArea = false;
        if($requestData){
            $requestData['course_time'] = mb_convert_kana( $requestData['course_time'] , "n");
            $requestData['number_of_frames'] = mb_convert_kana( $requestData['number_of_frames'] , "n");
            // 検索条件の表示・非表示の判定 $valueは配列の右側の意味
            foreach($requestData as $value){
                if($value != ''){
                    $isShowSearchArea = true;
                    break;
                }
            }   
        }
        

        $lectureConditions = $this->Lectures->newEntity($requestData);

        $this->logNotice($requestData);
        $this->logNotice($this->request->session()->read());
        $loginUserId = $this->request->session()->read('loginUserId');

        $where = [
                'Lectures.invalidation_flag' => $this->Enum->InvalidationFlag->OFF->value,
                'AreaOfStudies.invalidation_flag' => $this->Enum->InvalidationFlag->OFF->value,
        ];
        if($requestData){
            if($requestData['lecture_name'] != ''){
                $where['Lectures.lecture_name like'] = '%'. $requestData['lecture_name'] .'%';
            }
            if($requestData['area_of_study_name'] != ''){
                $where['AreaOfStudies.area_of_study_name like'] = '%'. $requestData['area_of_study_name'] . '%';
            }
            if(in_array($requestData['class_day'],$this->Enum->DayOfWeek->getValues(),true)){
                $where['Lectures.class_day'] = $requestData['class_day'];
            }
            if(!empty($requestData['course_time'])){
                $where['Lectures.course_time'] = $requestData['course_time'];
            }
            if(!empty($requestData['number_of_frames'])){
                $where['Lectures.number_of_frames'] = $requestData['number_of_frames'];
            }
            
        }

		$lectures = $this->Lectures->find()
			->contain([
				'AreaOfStudies',
                'InsertUser',
                'UpdateUser',
			])
            // =>はsql流のイコール
            ->where($where
                // Javascriptでphpを使いたいときは{}が必要なし、そのまま０でもいいがEnumの中に数字の説明が記載されている。
            )
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
            ->select(['id','area_of_study_name'])
            ->where([
                'invalidation_flag' => $this->Enum->InvalidationFlag->OFF->value
            ])
            ->toArray();
        foreach($areaOfStudyList as $areaOfStudy){
			$studyAreaOptions[] = [
                'value' => $areaOfStudy -> id,
                'text'  => $areaOfStudy -> area_of_study_name,
            ];
        }

            
        // $setはindex.tpl(Lecturesのやつ)でも使えるようにするもの
        $this->set(compact('loginUserId'));
		$this->set('lectures', json_encode($lectures));
		$this->set('courseTimes', json_encode($courseTimes));
        $this->set('studyAreaOptions', json_encode($studyAreaOptions));
        $this->set(compact('lectureConditions'));
        $this->set(compact('isShowSearchArea'));
        // $this->set('isShowSearchArea', json_encode($isShowSearchArea));
    }
    // 入力したデータを保存する処理↓
	public function save()
    {
		// 未実装		
        		$this->autoRender = false; // Viewを強制的に使わない
                // ↓これはindex.tplのdataの中身
        $data = $this->request->input('json_decode', true);

		$ret = [
			'errors' => '',
			'data' => [
            ]
		];

        // 有効な学問分類IDの取得
        $areaOfStudyIds = [];

        //         // Javascriptでphpを使いたいときは{}が必要なし
        $this->logNotice($data);
        $this->logNotice(!empty($data['editId']));
        if(!empty($data['editId'])){
            $lecture = $this->Lectures->get($data['editId']);
                $lecture = $this->Lectures->patchEntity($lecture,$data['selectedLecture'],['associated'=>false]);
        }else{
            // ～の～というようにデータを指定しているさらにそのデータをある値に指定している
            $data['selectedLecture']['insert_user_id'] = 0;
            $data['selectedLecture']['update_user_id'] = 0;
            $lecture = $this->Lectures->newEntity($data['selectedLecture'],['associated'=>false]);
        }

        // patchEntityは変更されたものを上書き
        // saveは上書きしただけのものを張り付けるもののイメージ
            $this->Lectures->save($lecture);

        $this->logNotice($ret);
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

        // $this->logNotice($data);
        $lecture = $this->Lectures->get($data['editId']);
        // patchEntityは変更されたものを上書き
        $lecture = $this->Lectures->patchEntity(
            $lecture,
            ['invalidation_flag' => $this->Enum->InvalidationFlag->ON->value],
            // ↓これでテーブルを固定化している
            ['associated'=>false]);
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
