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
        $lectures = $this->Lectures->getEffectiveList();

        // 受講している学生を取得
        $users = $this->Users->find()
            ->where([
                'authority' => $this->Enum->Authority->STUDENT->value
            ])
            ->order(['id'])
            ->toArray();

        $userIds = array_column($users, 'id');
        
        // ★ ひとまず全部の講座
        // ★ いずれ講座を限定したい
        $select = [
                    'Attendances.student_user_id',
                    'Attendances.semester',
                    'Attendances.lecture_id',
                    'Attendances.attendance_status',
                    'Attendances.lecture_number',
        ];
        $attendances = $this->Attendances->getEffectiveListByStudentUserIds($userIds, $select);

		$this->set(compact('loginUserId'));
        $this->set('lectures', json_encode($lectures));
        $this->set('users', json_encode($users));
        $this->set('attendances', json_encode($attendances));
        $this->set('attendanceStatusOptions', json_encode($this->Enum->AttendanceStatus->getValuesAndDescriptions()));
    }

    /**
     * 登録・更新処理
     */
    public function save()
    {	
        $this->autoRender = false; // Viewを強制的に使わない
        /** @var array $data */
        $data = $this->request->input('json_decode', true);

		$ret = [
			'errors' => '',
			'data'   => []
		];

        $this->logNotice($data);
        
        $attendanceEntities = [];
        // ★ patchEntities・newEntitiesにしたい・・・
        foreach($data['user_status_list'] as $userStatus){
            $existAttendance = $this->Attendances->find()
                ->select(['id'])
                ->where([
                    'student_user_id'   => $userStatus['user_id'],
                    'lecture_id'        => $data['lecture_id'],
                    'lecture_number'    => $userStatus['lecture_number'],
                    'semester'          => $userStatus['semester'],
                    'invalidation_flag' => $this->Enum->InvalidationFlag->OFF->value,
                ])
                ->first();
            if(!empty($existAttendance)){
                if($userStatus['status']===''){
                    // データがあったのに未入力へ変更された場合は削除
                    $attendanceEntities[] = $this->Attendances->patchEntity($existAttendance, [
                        'update_user_id'    => $this->request->session()->read('loginUserId'),
                        'invalidation_flag' => $this->Enum->InvalidationFlag->ON->value,
                        'delete_date'       => new FrozenTime(),
                    ]);
                }else{
                    $attendanceEntities[] = $this->Attendances->patchEntity($existAttendance, [
                        'attendance_status' => $userStatus['status'],
                        'update_user_id'    => $this->request->session()->read('loginUserId'),
                    ]);
                }
            }else{
                $attendance = $this->Attendances->newEntity([
                    'student_user_id'   => $userStatus['user_id'],
                    'lecture_id'        => $data['lecture_id'],
                    'lecture_number'    => $userStatus['lecture_number'],
                    'attendance_status' => $userStatus['status'],
                    'semester'          => $userStatus['semester'],
                    'invalidation_flag' => $this->Enum->InvalidationFlag->OFF->value,
                    'insert_user_id'    => $this->request->session()->read('loginUserId'),
                    'update_user_id'    => $this->request->session()->read('loginUserId'),
                ]);
                $attendanceEntities[] = $attendance;
            }
        }
        
        $this->Attendances->saveMany($attendanceEntities);

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
