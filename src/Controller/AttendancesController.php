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
        
        //講座一覧 Query Builder
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

        // foreach ($data['attendance_status_list'] as $attendanceStatus){
        //     // (a) テーブルの中から条件に合うものを取得
        //     $attendance = $this->Attendances->find()
        //         ->where([
        //             'student_user_id'   => $attendanceStatus['user_id'],
        //             'lecture_id'        => $data['lecture_id'],
        //             'lecture_number'    => $attendanceStatus['lecture_number'],
        //             'semester'          => $this->Enum->Semester->FIRST_SEMESTER->value,
        //             'invalidation_flag' => $this->Enum->InvalidationFlag->OFF->value,
        //         ])
        //         ->first(); // 1件だけ取得
        //     $this->logNotice($attendance);

        //     $loginUserId = $this->request->session()->read('loginUserId');
        //     $now = new FrozenTime();

        //     // (a)で取得したEntityにstatusなどのcolumnの値を変更 ※DBにはまだ登録されてない
        //     $attendance = $this->Attendances->patchEntity(
        //         $attendance,
        //         [
        //             'attendance_status' => $attendanceStatus['status'],
        //             'update_date'       => $now,
        //             'update_user_id'    => $loginUserId,
        //         ],
        //         ['associated' => false]
        //     );
        //     // 実際にDB更新を行う
        //     $this->Attendances->save($attendance);
        // }

        // // 登録処理
        foreach ($data['attendance_status_list'] as $attendanceStatus) {
            $attendanceData = $this->getDataForAdd($data['lecture_id'], $attendanceStatus);
            $attendance = $this->Attendances->newEntity($attendanceData, ['associated'=>false]);
            $this->Attendances->save($attendance);
        }

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

    private function getDataForAdd($lectureId, $inputData)
    {
        $loginUserId = $this->request->session()->read('loginUserId');
        $now = new FrozenTime();

        return [
                'lecture_id'        => $lectureId,
                'student_user_id'   => $inputData['user_id'],
                'lecture_number'    => $inputData['lecture_number'],
                'attendance_status' => $inputData['status'],
                'semester'          => $this->Enum->Semester->FIRST_SEMESTER->value,
                'insert_date'       => $now,
                'insert_user_id'    => $loginUserId,
                'update_date'       => $now,
                'update_user_id'    => $loginUserId,
                'invalidation_flag' => $this->Enum->InvalidationFlag->OFF->value,
            ];
    }

}
