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
        $attendanceList = $this->Attendances->find()
            // ->select()
            ->where([
                'semester'          => $this->Enum->Semester->FIRST_SEMESTER->value,
                'invalidation_flag' => $this->Enum->InvalidationFlag->OFF->value,
            ])
            ->toArray();

        $this->logNotice($attendanceList);

        
		// ゆくゆくはsessionへ
		$user = $this->Users->get($id);

		$this->set(compact('user'));
    }
}
