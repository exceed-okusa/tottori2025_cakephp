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
        // controllerで制御
		$this->logNotice('index opened');
        
        $this->request->session()->delete('loginUserId');

        // ↓一時的なかごを作成している
        $this->logNotice($this->request->session()->read());


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
        $this->logNotice($this->request->session()->read());

		$user = $this->Users->getOneByLogin($data['account'], $data['password']);
		if (!empty($user)) {
        $this->request->session()->write('loginUserId' , $user->id);
        // $this->request->session()->write('loginUserId' , $user);
            $ret['data'] = ['user'=> $user, 'status' => 'success', 'message' => 'ログイン成功'];
        } else {
            $ret['data'] = ['user'=> null, 'status' => 'error', 'message' => 'アカウントまたはパスワードが間違っています。'];
            // $ret['data'] = ['user'=> null, 'status' => 'error', 'message' => 'アカウントまたはパスワードが間違っています。', 'message2' =>'ログイン失敗:'+'loginErrorCount'+'回'];
        }
         $this->logNotice($this->request->session()->read());

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
