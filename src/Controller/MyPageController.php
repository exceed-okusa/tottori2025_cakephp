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


        // IDをキーにしたマップを作成
        $lectureMap = array_column($lectures, null, 'id');
        $userMap    = array_column($userList, null, 'id');

        // 講座ごとに出席データをグループ化
        $result = [];
        foreach ($attendanceList as $a) {
            $lid = $a->lecture_id;
            $uid = $a->student_user_id;

            if (!isset($result[$lid])) {
                $result[$lid] = [
                    'lecture_name' => isset($lectureMap[$lid]) ? $lectureMap[$lid]->lecture_name : '',
                    'attendances'  => [],
                ];
            }
            $result[$lid]['attendances'][] = [
                'user_name'      => isset($userMap[$uid]) ? $userMap[$uid]->family_name . ' ' . $userMap[$uid]->first_name : '',
                'lecture_number' => $a->lecture_number,
                'status'         => $a->attendance_status,
            ];
        }

        $this->logNotice($result);

        
		// ゆくゆくはsessionへ
		$user = $this->Users->get($id);

		$this->set(compact('user'));
    }
}
