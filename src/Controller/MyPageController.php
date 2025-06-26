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
		// ゆくゆくはsessionへ
		$user = $this->Users->get($id);
		// $this->logNotice($user);

		$this->set(compact('user'));
    }
}
