<?php

namespace App\Controller;

use App\Form\LoginForm;
use Cake\Controller\Controller;

/**
 * Class LoginController
 * @package App\Controller
 */
class LoginController extends BaseController
{
    public function index()
    {
		$this->logNotice('index opened');


    }

    /**
     * ログイン処理
     * ajax
     * @throws \Exception
     */
    public function login()
    {
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

		$user = $this->Users->getOneByLogin($data['account'], $data['password']);
		if (!empty($user)) {
            $ret['data'] = ['user'=> $user, 'status' => 'success', 'message' => 'ログイン成功'];
        } else {
            $ret['data'] = ['user'=> null, 'status' => 'error', 'message' => 'アカウントまたはパスワードが間違っています。'];
        }

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
