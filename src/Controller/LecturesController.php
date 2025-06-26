<?php

namespace App\Controller;

use Cake\Controller\Controller;

/**
 * Class LecturesController
 * @package App\Controller
 */
class LecturesController extends BaseController
{
    public function index()
    {
		$lectures = $this->Lectures->find()
			->contain([
				'AreaOfStudies'
			])
			->select([
				'Lectures.id',
				'Lectures.lecture_name',
				'Lectures.class_day',
				'Lectures.course_time',
				'Lectures.number_of_frames',
				'Lectures.area_of_study_id',
				'AreaOfStudies.area_of_study_name',
			])
			->order([
				'Lectures.id' => 'ASC'
			])
			->toArray();

		$courseTimes = [];
		$number = 1;
		while($number <= 6){
			$courseTimes[] = ['value' => $number, 'text' => ($number .'限')];
			$number++;
		}

		$this->set('lectures', json_encode($lectures));
		$this->set('courseTimes', json_encode($courseTimes));
    }

	public function save()
    {
		// 未実装		

    }
}
