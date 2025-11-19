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

$this->logNotice($this->request->session()->read());
        $loginUserId = $this->request->session()->read('loginUserId');

		$lectures = $this->Lectures->find()
			->contain([
				'AreaOfStudies',
                'InsertUser',
                'UpdateUser',
			])
            // =>はsql流のイコール
            ->where([
                // Javascriptでphpを使いたいときは{}が必要なし、そのまま０でもいいがEnumの中に数字の説明が記載されている。
                'Lectures.invalidation_flag' => $this->Enum->InvalidationFlag->OFF->value,
                'AreaOfStudies.invalidation_flag' => $this->Enum->InvalidationFlag->OFF->value,
            ])
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

        // $setはindex.tpl(Lecturesのやつ)でも使えるようにするもの
        $this->set(compact('loginUserId'));
		$this->set('lectures', json_encode($lectures));
		$this->set('courseTimes', json_encode($courseTimes));
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
                'areaOfStudyIdError' => false,
            ]
		];

        // 有効な学問分類IDの取得
        $areaOfStudyIds = [];

        $areaOfStudyList = $this->AreaOfStudies->find()
            // =>はsql流のイコール
            ->select(['id'])
            ->where([
                // Javascriptでphpを使いたいときは{}が必要なし
                'invalidation_flag' => $this->Enum->InvalidationFlag->OFF->value
            ])
			->toArray();
            $areaOfStudyIds = array_column($areaOfStudyList, 'id');
        
        $this->logNotice($areaOfStudyList);   
        $this->logNotice($areaOfStudyIds);   

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

        if(!in_array($data['selectedLecture']['area_of_study_id'],$areaOfStudyIds)){
            $ret['data']['areaOfStudyIdError'] = true;
        }
        $this->logNotice($ret['data']['areaOfStudyIdError']);        
        // $this->logNotice($data['invalidation']);
        // $this->logNotice($data);
        // patchEntityは変更されたものを上書き
        if($ret['data']['areaOfStudyIdError']){
            $this->Lectures->save($lecture);
        }

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
