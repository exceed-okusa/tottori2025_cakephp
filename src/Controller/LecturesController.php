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

$this->logNotice($this->request->session()->read());

        $loginUserId = $this->request->session()->read('loginUserId');

		$lectures = $this->Lectures->find()
			->contain([
				'AreaOfStudies',
                'InsertUser',
                'UpdateUser',
			])
			->where([
				'Lectures.invalidation_flag' => $this->Enum->invalidation_flag->OFF->value,
				'AreaOfStudies.invalidation_flag' => $this->Enum->invalidation_flag->OFF->value,
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

        // $this->set('loginUserId', $loginUserId);
		$this->set(compact('loginUserId'));
        $this->set('lectures', json_encode($lectures));
		$this->set('courseTimes', json_encode($courseTimes));
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
