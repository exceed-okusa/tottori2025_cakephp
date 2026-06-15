<?php

namespace App\Controller;

use App\Utils\Enum;
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

        // $this->logNotice($this->request->session()->read());
            $loginUserId = $this->request->session()->read('loginUserId');

            $lectures = $this->Lectures->find();
            $this->set(compact('loginUserId'));
            $this->set('lectures', json_encode($lectures));
    }
    public function edit()
    {
            $loginUserId = $this->request->session()->read('loginUserId');

                $lectureList = $this->Lectures->find()
            ->where([
                'invalidation_flag' => $this->Enum->InvalidationFlag->OFF->value,
            ])
            ->toArray();

        $userList = $this->Users->find()
            ->where([
                'authority' => $this->Enum->Authority->STUDENT->value,
            ])
            ->toArray();

        $attendancesGrouped =[];
 
        foreach($lectureList as $lecture){
            $data = [];
            foreach($userList as $user){
                $attendance_status = [];
                    $attendancesData = $this->Attendances->find()
                        ->select(['attendance_status','lecture_number'])
                        ->where([
                            'semester'          => $this->Enum->Semester->FIRST_SEMESTER->value,
                            'invalidation_flag' => $this->Enum->InvalidationFlag->OFF->value,
                            'lecture_id'        => $lecture['id'],
                            'student_user_id'   => $user['id']
                        ])
                        ->toArray();

                    $attendanceStatusList = [];
                    for($i=1; $i<=15; $i++){
                        $attendanceStatusList[$i] = '';
                        foreach($attendancesData as $entity){
                            if($i == $entity['lecture_number']){
                                $attendanceStatusList[$i] = $entity['attendance_status'];
                                break;
                            }
                        }
                    }

                $data[] = ['student_user_id' => $user['id'], 'attendance_list' => $attendanceStatusList];
            }
            $attendancesGrouped[] = ['lecture_id' => $lecture['id'], 'data' => $data];
        }


        $aaa = $this->Enum->AttendanceStatus->getValues();
        $bbb = $this->Enum->AttendanceStatus->getTexts();
        $this->logNotice($bbb);

        $ccc = [];

        foreach($aaa as $status){
            // $this->logNotice('現在のvalueは' . $status . 'です。');
            $this->logNotice($this->Enum->AttendanceStatus->getTextByValue($status));
            // $this->logNotice($this->Enum->AttendanceStatus->getDescriptionByValue($status));
        }
        

        $this->set(compact('loginUserId'));
        $this->set('lectures', json_encode($lectureList));
        $this->set('users', json_encode($userList));
        $this->set('attendances', json_encode($attendancesGrouped));
        $this->set('textArray', json_encode($ccc));
    }
    public function save(){
        $this->autoRender = false; // Viewを強制的に使わない
                // ↓これはindex.tplのdataの中身
        $data = $this->request->input('json_decode', true);

		$ret = [
			'errors' => '',
			'data' => [
            ]
		];

        $this->logNotice($data);


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