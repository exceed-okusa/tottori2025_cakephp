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
    $requestData = $this->request->query;

    $isInitial = empty($requestData);
    $isSearch = false;
    $isTest = false;
    if (!$isInitial) {
      $isTest   =  array_key_exists('sort', $requestData);
      $isSearch = !array_key_exists('sort', $requestData);
    }

    $isShowSearchArea = false;
    if ($isSearch) { // $requestData != []
      // 検索条件の表示・非表示の判定
      foreach ($requestData as $value) {
          if ($value != '') {
            $isShowSearchArea = true;
            break;
          }
      }
    }

    $areaOfStudies = $this->AreaOfStudies->newEntity($requestData);

    $loginUserId = $this->request->session()->read('loginUserId');

    $where = [
      'AreaOfStudies.invalidation_flag' => $this->Enum->InvalidationFlag->OFF->value
    ];

    if ($isSearch) {
      if ($requestData['area_of_study_name'] != '') {
        $where['AreaOfStudies.area_of_study_name LIKE'] = '%' . $requestData['area_of_study_name'] . '%';
      }
    }

    $order = [
      'AreaOfStudies.id' => 'ASC',
    ];

    if ($isTest) {
      $column = '';
      switch ($requestData['sort']) {
        case 'area_of_study_id':
          $column = 'AreaOfStudies.id';
          break;
        case 'area_of_study_name':
          $column = 'AreaOfStudies.area_of_study_name';
          break;
      }

      $order = [
        $column => $requestData['direction'],
      ];
    }

    $areaOfStudies = $this->AreaOfStudies->find()
      ->contain([
        'InsertUser',
        'UpdateUser',
			])
      ->where($where)
      ->order($order)
      ->toArray();
      
    $isOrderAsc = true;
    $hasOrderColumn = 'area_of_study_id';
    // $requestData['direction'] :ASC なら true / DESC なら false
    if ($isTest) {
      if ($requestData['direction'] == 'DESC') {
        $isOrderAsc = false;
      }
      $hasOrderColumn = $requestData['sort'];
    }
    
    $this->set(compact('isOrderAsc', 'hasOrderColumn'));
    $this->set(compact('loginUserId', 'areaOfStudies', 'isShowSearchArea'));
    $this->set('areaOfStudies', json_encode($areaOfStudies));
  }

  public function save()
  {	
    $this->autoRender = false; // Viewを強制的に使わない
    $data = $this->request->input('json_decode', true);
  
		$ret = [
			'errors' => '',
			'data' => []
		];

    if (!empty($data['editId'])) {
      // 編集
      $areaOfStudy = $this->AreaOfStudies->get($data['editId']);
      $areaOfStudy = $this->AreaOfStudies->patchEntity($areaOfStudy, $data['selectedAreaOfStudy'], ['associated'=>false]);
    } else {
      // 追加
      $data['selectedAreaOfStudy']['insert_user_id'] = 0;
      $data['selectedAreaOfStudy']['update_user_id'] = 0;
      $data['selectedAreaOfStudy']['invalidation_flag'] = $this->Enum->InvalidationFlag->OFF->value;
      $areaOfStudy = $this->AreaOfStudies->newEntity($data['selectedAreaOfStudy'], ['associated'=>false]);
    }

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
    $areaOfStudy = $this->AreaOfStudies->patchEntity($areaOfStudy, $dataForPatch, ['associated'=>false]);
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
