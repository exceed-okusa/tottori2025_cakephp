<?php

namespace App\Controller;

use Cake\I18n\FrozenTime;

/**
 * Class AttendancesController
 * @package App\Controller
 */
class AttendancesController extends BaseController
{
    public function index()
    {
        $loginUserId = $this->request->session()->read('loginUserId');
        $lectures = $this->Lectures->getEffectiveList();
        $lectureIds = array_column($lectures, 'id');
        $select = [
                    'Attendances.student_user_id',
                    'Attendances.semester',
                    'Attendances.lecture_id',
                    'Attendances.attendance_status',
                    'Attendances.lecture_number',
        ];
        $attendances = $this->Attendances->getEffectiveListByStudentUserIds([$loginUserId], $select);
		$attendancesForTemplate = [];
        foreach ($lectureIds as $lectureId) {
            for ( $lectureNumber = 1; $lectureNumber <= 15; $lectureNumber++ ) {
                $attendancesForLecture = [];
                foreach ($attendances as $attendance) {
                    if ($attendance->lecture_id == $lectureId && $attendance->lecture_number == $lectureNumber) {
                        $attendancesForLecture[] = $attendance->attendance_status;
                        break 2;
                    }
                }
                $attendancesForLecture[] = '';
            }
        }
        
        $this->set(compact('loginUserId'));
        $this->set('lectures', json_encode($lectures));
        $this->set('lectureIds', json_encode($lectureIds));
        $this->set('attendances', json_encode($attendances));
        $this->set('attendancesForTemplate', json_encode($attendancesForTemplate));
    }

    /**
     * 教員・システム管理者用メニュー
     * 出席管理
     */
    public function edit()
    {
        $loginUserId = $this->request->session()->read('loginUserId');
        
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

		$this->set(compact('loginUserId'));
        $this->set('lectures', json_encode($lectures));
        $this->set('users', json_encode($userList));
        $this->set('attendances', json_encode($attendancesGrouped));
        $this->set('attendanceStatusOptions', json_encode($this->Enum->AttendanceStatus->getValuesAndDescriptions()));
    }

    /**
     * 登録・更新処理
     */
    public function save()
    {	
        $this->autoRender = false; // Viewを強制的に使わない
        $data = $this->request->input('json_decode', true);

		$ret = [
			'errors' => '',
			'data' => []
		];
        // ここから処理を記述
        $this->logNotice($data);

        $attendance = $this->Attendances->newEntity([
            'lecture_id'        => $data['lecture_id'],
            'student_user_id'   => $data['attendance_status_list'][0]['user_id'],
            'lecture_number'    => $data['attendance_status_list'][0]['lecture_number'],
            'attendance_status' => $data['attendance_status_list'][0]['status']
        ], ['associated'=>false]);
        $this->logNotice($attendance);

        $this->Attendances->save($attendance);

        // ここまで
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
