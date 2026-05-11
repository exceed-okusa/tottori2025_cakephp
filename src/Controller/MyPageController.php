<?php

namespace App\Controller;

use Cake\Controller\Controller;

/**
 * Class MyPageController
 * @package App\Controller
 */
class MyPageController extends BaseController
{
    public function edit($id)
    {
        //講座一覧
        $lectures = $this->Lectures->find()
            ->where([
                'invalidation_flag' => $this->Enum->InvalidationFlag->OFF->value,
            ])
            ->toArray();

            // $this->logNotice($lectures);

        // ユーザー一覧
        $userList = $this->Users->find()
            ->toArray();

        // $this->logNotice($userList);

        $attendanceList = $this->Attendances->find()
            // ->select()
            ->where([
                'semester'          => $this->Enum->Semester->FIRST_SEMESTER->value,
                'invalidation_flag' => $this->Enum->InvalidationFlag->OFF->value,
            ])
            ->toArray();

        // $this->logNotice($attendanceList);

        $attendancesGrouped = [];
        foreach ($attendanceList as $attendance) {
            $attendancesGrouped[$attendance->lecture_id][$attendance->student_user_id][$attendance->lecture_number] = $attendance->attendance_status;
        }

        $this->logNotice($attendancesGrouped);

        
		// ゆくゆくはsessionへ
		$user = $this->Users->get($id);

		$this->set(compact('user', 'attendancesGrouped'));
    }
}
