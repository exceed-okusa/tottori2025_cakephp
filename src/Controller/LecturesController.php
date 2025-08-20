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
		$lectures = $this->Lectures->find()
			->contain([
				'AreaOfStudies',
                'InsertUser',
                'UpdateUser',
			])
            // =>はsql流のイコール
            ->where([
                // Javascriptでphpを使いたいときは{}が必要なし
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

		$this->set('lectures', json_encode($lectures));
		$this->set('courseTimes', json_encode($courseTimes));
    }
    // 入力したデータを保存する処理↓
	public function save()
    {
		// 未実装		
        		$this->autoRender = false; // Viewを強制的に使わない
        $data = $this->request->input('json_decode', true);

		$ret = [
			'errors' => '',
			'data' => []
		];
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
        // $this->logNotice($data['invalidation']);
        // $this->logNotice($data);
        // patchEntityは変更されたものを上書き
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
