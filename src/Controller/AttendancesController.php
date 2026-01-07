<?php

namespace App\Controller;

use Cake\Controller\Controller;
use Cake\I18n\FrozenTime;


/**
 * Class AttendancesController
 * @package App\Controller
 */
class AttendancesController extends BaseController
{
    public function index()
    {
        
        $this->logNotice($this->request->session()->read());

        $loginUserId = $this->request->session()->read('loginUserId');



		$lectures = $this->Lectures->find()
			->contain([
				'AreaOfStudies',
                // 'Users'
                'InsertUser',
                'UpdateUser',
			])
            ->where([
                'Lectures.invalidation_flag' => $this->Enum->InvalidationFlag->OFF->value,
                'AreaOfStudies.invalidation_flag' => $this->Enum->InvalidationFlag->OFF->value
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
        // $this->set('loginUserId',$loginUserId);
        $this->set(compact('loginUserId'));
		$this->set('lectures', json_encode($lectures));
		$this->set('courseTimes', json_encode($courseTimes));
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
        
        if(!empty($data['editId'])){
            $lecture = $this->Lectures->get($data['editId']);
            $lecture = $this->Lectures->patchEntity($lecture,$data['selectedLecture'],['associated'=>false]);
        }else{
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

    public function edit()
    {
        $students = $this->Users->find()
            ->select([
                'id','family_name','first_name'
            ])
            ->where([
                'Users.authority' => $this->Enum->Authority->STUDENT->value
            ])
            ->toArray();
            $this->logNotice($students);

        $this->set('students',json_encode($students));

        $lectures = $this->Lectures->find()
            ->select([
                'id','lecture_name'
            ])
            ->toArray();
            $this->logNotice($lectures);

        $this->set('lectures',json_encode($lectures));

        $studentId = $this->Attendances->find()
            ->select([
                'id','student_user_id','attendance_status','lecture_number','lecture_id'
            ])
            ->toArray();
            $this->logNotice($studentId);

        $this->set('studentId',json_encode($studentId));
    }
}

