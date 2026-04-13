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
        $attendances = $this->Attendances->find()
        ->contain([
            'Users',
        ])
        // ->where([
        //     'Attendances.student_user_id' => 'Users.id'
        // ])
        ->order([
            'Attendances.student_user_id' => 'ASC'
        ])
        ->toArray();
        $this->logNotice($attendances);

        // $this->logNotice($this->request->session()->read());
            $loginUserId = $this->request->session()->read('loginUserId');

            $users = $this->Users->find()->toArray();
            $lectures = $this->Lectures->find()->toArray();
            $attendances = $this->Attendances->find()->toArray();
            // $this->logNotice($users);
            // $target = ($attendances['student_user_name'] == $users['id']);
            $this->set(compact('loginUserId'));
            $this->set(compact('target'));
            $this->set('users', json_encode($users));
            $this->set('lectures', json_encode($lectures));
            $this->set('attendances', json_encode($attendances));
    }
}