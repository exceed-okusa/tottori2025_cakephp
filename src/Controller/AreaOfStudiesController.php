<?php

namespace App\Controller;

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
    $loginUserId = $this->request->session()->read('loginUserId');

    $requestData = $this->request->query;
        $this->logNotice($requestData);

    $isInitial = false;
        $isSearch = false;
        $isTest = false;

    $where = [
        'AreaOfStudies.invalidation_flag' => $this->Enum->InvalidationFlag->OFF->value
    ];

    if (!empty($requestData)) {
            // sortがある
            if (array_key_exists('sort', $requestData)) {
                $isTest = true;
            } else {
                $isSearch = true;
            }
    } else {
            // empty($requestData)
            $isInitial = true;
    }

    $isShowSearchArea = false;

        if($isSearch){
            foreach ($requestData as $value) {
                if ($value != '') {
                    $isShowSearchArea = true;
                    break;
                }
            }
        }

        $lectureConditions = $this->AreaOfStudies->newEntity($requestData);
        $this->logNotice($lectureConditions);
        

        $this->logNotice($this->request->session()->read());

        $loginUserId = $this->request->session()->read('loginUserId');

        $where = [
            
                'AreaOfStudies.invalidation_flag' => $this->Enum->InvalidationFlag->OFF->value
        ];

        $order = [
            'AreaOfStudies.id' => 'ASC',
        ];
        if($isTest){
            $column = '';
            if($requestData['sort'] == 'area_of_study_id'){
                $column = 'AreaOfStudies.id';
            }
            if($requestData['sort'] == 'area_of_study_name'){
                $column = 'AreaOfStudies.area_of_study_name';
            }
            
        
            $order = [
                $column => $requestData['direction'],
            ];
        }

        if($isSearch) {
            if($requestData['area_of_study_name'] != '') {
                $where['AreaOfStudies.area_of_study_name LIKE'] = '%' . $requestData['area_of_study_name'] . '%';
            }
        }

    $areaOfStudies = $this->AreaOfStudies->find()
    ->contain([
            'InsertUser',
            'UpdateUser',
			])
    ->where($where)
    ->order($order)
    ->toArray();
    $this->logNotice($areaOfStudies);

    $isOrderAsc = true;
    $hasOrderColumn = 'area_of_study_id';//study_area_nameのこと

    if($isTest){
                if($requestData['direction'] == 'DESC'){
                    $isOrderAsc = false;
                }
                $hasOrderColumn = $requestData['sort'];
    }

    $this->set(compact('isOrderAsc','hasOrderColumn'));
    $this->set(compact('loginUserId', 'areaOfStudies'));
    $this->set('areaOfStudies', json_encode($areaOfStudies));
    $this->set(compact('isShowSearchArea'));
    }

    public function save(){
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

        if(!empty($data['editId'])){
            // 編集
            $areaOfStudy = $this->AreaOfStudies->get($data['editId']);
            $areaOfStudy = $this->AreaOfStudies->patchEntity($areaOfStudy,$data['selectedAreaOfStudy'],['associated'=>false]);
        }else{
            // 追加
            $data['selectedAreaOfStudy']['insert_user_id'] = 0;
            $data['selectedAreaOfStudy']['update_user_id'] = 0;
            $data['selectedAreaOfStudy']['insert_date'] = new FrozenTime();
            $data['selectedAreaOfStudy']['update_date'] = new FrozenTime();
            $data['selectedAreaOfStudy']['invalidation_flag'] = 0;

            
            $areaOfStudy = $this->AreaOfStudies->newEntity($data['selectedAreaOfStudy'],['associated'=>false]);

        }
        $this->logNotice($areaOfStudy);
        $this->AreaOfStudies->save($areaOfStudy);

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
		// 未実装		
        $this->autoRender = false; // Viewを強制的に使わない
        $data = $this->request->input('json_decode', true);

		$ret = [
			'errors' => '',
			'data' => []
		];

        $dataForPatch = [
            'invalidation_flag' => $this->Enum->InvalidationFlag->ON->value,
            'delete_date'       => new FrozenTime()
        ];
        $areaOfStudy = $this->AreaOfStudies->get($data['editId']);
        // $this->logNotice($lecture);
        $areaOfStudy = $this->AreaOfStudies->patchEntity($areaOfStudy,$dataForPatch,['associated'=>false]);
        // $this->logNotice($lecture);
        // $this->Lectures->delete($lecture);
        $this->AreaOfStudies->save($areaOfStudy);
		

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
