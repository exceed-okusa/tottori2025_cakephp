<?php

namespace App\Controller;

use App\Utils\Enum;
use Cake\Controller\Controller;
use Cake\I18n\FrozenTime;

/**
 * Class AreaOfStudiesController
 * @package App\Controller
 */
class AreaOfStudiesController extends BaseController
{
    public function index()
    {
        $requestData = $this->request->query;
        $this->logNotice($requestData);

        $isSearch = false;
        $isTest   = false;
        $isShowSearchArea = false;
        $lectureConditions = $this->Lectures->newEntity($requestData);
        $loginUserId = $this->request->session()->read('loginUserId');


        if($requestData){
            if(!array_key_exists('sort',$requestData)){
                $isSearch = true;
            }else{
                $isTest = true;
            };
        }

        if($isSearch){
            foreach($requestData as $value){
                if($value != ''){
                    $isShowSearchArea = true;
                    break;
                }
            }   
        }

        $where = [
                'AreaOfStudies.invalidation_flag' => $this->Enum->InvalidationFlag->OFF->value,
        ];
        $order = [
            'AreaOfStudies.id' => 'ASC',
        ];
        $sort = false;
        $direction = 'ASC';
        if($isTest){
            $column = '';
            switch ($requestData['sort']) {
                case 'area_of_study_id';
                    $column = 'AreaOfStudies.id';
                    break;
                case 'area_of_study_name';
                    $column = 'AreaOfStudies.area_of_study_name';
                    break;
            }
            $order = [
                $column => $requestData['direction'],
            ];
            $sort = $requestData['sort'];
            $direction = $requestData['direction'];
        }

        if($isSearch){
            if($requestData['area_of_study_name'] != ''){
                $where['AreaOfStudies.area_of_study_name like'] = '%'. $requestData['area_of_study_name'] .'%';
            }            
        }

        $areaOfStudies = $this->AreaOfStudies->find()
        ->contain([
            'InsertUser',
            'UpdateUser',
        ])
        ->where([
                $where
            ])
        ->order($order)
        ->toArray();

        $this->logNotice($areaOfStudies);
        $loginUserId = $this->request->session()->read('loginUserId');
        $this->set(compact('isShowSearchArea'));
        $this->set(compact('loginUserId'));
        $this->set('areaOfStudies', json_encode($areaOfStudies));
        $this->set(compact('sort'));
        $this->set(compact('direction'));
        $this->set(compact('isShowSearchArea'));
    }
    // 入力したデータを保存する処理↓
    public function save()
    {
		// 未実装		
        $this->autoRender = false; // Viewを強制的に使わない
                // ↓これはindex.tplのdataの中身
        $data = $this->request->input('json_decode', true);

		$ret = [
			'errors' => '',
			'data' => [
            ]
		];

        // 有効な学問分類IDの取得
        $this->logNotice($data);
        if(!empty($data['editId'])){
            $areaOfStudies = $this->AreaOfStudies->get($data['editId']);
            $areaOfStudies = $this->AreaOfStudies->patchEntity($areaOfStudies,$data['selectedAreaOfStudy'],['associated'=>false]);
        }else{
            // ～の～というようにデータを指定しているさらにそのデータをある値に指定している
            $data['selectedAreaOfStudy']['insert_user_id'] = 0;
            $data['selectedAreaOfStudy']['update_user_id'] = 0;
            $data['selectedAreaOfStudy']['invalidation_flag'] = 0;
            $areaOfStudies = $this->AreaOfStudies->newEntity($data['selectedAreaOfStudy'],['associated'=>false]);
        }

        // patchEntityは変更されたものを上書き
        // saveは上書きしただけのものを張り付けるもののイメージ
        $this->logNotice($areaOfStudies);
        $this->AreaOfStudies->save($areaOfStudies);

        $this->logNotice($ret);
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

    public function delete()
    {
        		$this->autoRender = false; // Viewを強制的に使わない
        $data = $this->request->input('json_decode', true);

		$ret = [
			'errors' => '',
			'data' => []
		];

        $AreaOfStudy = $this->AreaOfStudies->get($data['editId']);
        // patchEntityは変更されたものを上書き
        $AreaOfStudy = $this->AreaOfStudies->patchEntity(
            $AreaOfStudy,
            ['invalidation_flag' => $this->Enum->InvalidationFlag->ON->value],
            // ↓これでテーブルを固定化している
            ['associated'=>false]);
        $this->AreaOfStudies->save($AreaOfStudy);

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
