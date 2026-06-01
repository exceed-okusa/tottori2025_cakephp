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

        // $attendances = $this->Attendances->find()
        //     ->contain([
                
        //     ])
        //     ->toArray();
        // $userIds = array_column($users, 'id');

        $select = [
                    'Attendances.student_user_id',
                    'Attendances.semester',
                    'Attendances.lecture_id',
                    'Attendances.attendance_status',
                    'Attendances.lecture_number',
        ];
        // $attendances = $this->Attendances->getEffectiveListByStudentUserIds($userIds,$select);

        $attendanceList = $this->Attendances->find()
            // ->select()
            ->where([
                'semester'          => $this->Enum->Semester->FIRST_SEMESTER->value,
                'invalidation_flag' => $this->Enum->InvalidationFlag->OFF->value,
            ])
            ->toArray();

        $attendancesGrouped = [];
        
        foreach($attendanceList as $attendance){
            $attendancesGrouped[$attendance->lecture_id][$attendance->student_user_id][$attendance->lecture_number] = $attendance->attendance_status;
        }
        $this->logNotice($attendancesGrouped);

		$courseTimes = [];
		$number = 1;
		while($number <= 6){
			$courseTimes[] = ['value' => $number, 'text' => ($number .'限')];
			$number++;
		}
        // $this->set('loginUserId',$loginUserId);
        $this->set(compact('loginUserId'));
		$this->set('lectures', json_encode($lectures));
		// $this->set('users', json_encode($users));
        $this->set('attendancesGrouped', json_encode($attendancesGrouped));
        $this->set('attendancesStatusOptions',json_encode($this->Enum->AttendanceStatus->getValuesAndDescriptions()));

        

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
        
        // $studentUserIds = [];
        // $areaOfStudyList = $this->AreaOfStudies->find()
        //     ->select([
        //         'id'
        //     ])
        //     ->where([
        //         'AreaOfStudies.invalidation_flag' => $this->Enum->InvalidationFlag->OFF->value
        //     ])
        //     ->toArray();
        //     foreach($areaOfStudyList as $areaOfStudy){
        //         $areaOfStudyIds[] = $areaOfStudy['id'];
        //     }
        // $this->logNotice($areaOfStudyList);
        // $this->logNotice($studentUserIds);

        
        // 
        
        // $this->logNotice($lecture);
        
        
    
		

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
        //講座一覧
        $lectures = $this->Lectures->find()
            ->where([
                'invalidation_flag' => $this->Enum->InvalidationFlag->OFF->value,
            ])
            ->toArray();

        // 学生一覧
        $userList = $this->Users->find()
            ->where([
                'authority' => $this->Enum->Authority->STUDENT->value,
            ])
            ->toArray();

        $attendancesGrouped = [];
        foreach ($lectures as $lecture) {
            // data
            $data = [];
            foreach ($userList as $user) {
                $attendancesData = $this->Attendances->find()
                    ->select(['lecture_number', 'attendance_status'])
                    ->where([
                        'lecture_id'        => $lecture->id,
                        'student_user_id'   => $user->id,
                        'semester'          => $this->Enum->Semester->FIRST_SEMESTER->value,
                        'invalidation_flag' => $this->Enum->InvalidationFlag->OFF->value,
                    ])
                    ->toArray();
                
                $attendanceStatusList = [];
                // 初期値をセット
                for ($i=1; $i<=15; $i++) {
                    $attendanceStatusList[$i] = '';
                }
                // データがあればそれを使用
                foreach ($attendancesData as $entity) {
                    $attendanceStatusList[$entity->lecture_number] = $entity->attendance_status;
                }

                $data[] = [
                    'student_user_id' => $user->id,
                    'attendance_status_list' => $attendanceStatusList,
                ];
            }

            $attendancesGrouped[] = [
                'lecture_id' => $lecture->id,
                'data'       => $data,
            ];
        }


        $this->logNotice($attendancesGrouped);

        $aaa = $this->Enum->AttendanceStatus->getValues();
        foreach($aaa as $status){
            $this->logNotice($this->Enum->AttendanceStatus->getTextByValue($status));
        }

        $this->Enum->AttendanceStatus->getTextByValue();

        $this->set(compact('loginUserId'));
        $this->set('lectures', json_encode($lectures));
        $this->set('users', json_encode($userList));
        $this->set('attendances', json_encode($attendancesGrouped));
    }
}

