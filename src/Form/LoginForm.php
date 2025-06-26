<?php
namespace App\Form;

use App\Utils\CustomTextValidation;
use Cake\Validation\Validator;

class LoginForm extends BaseForm
{
    protected function validationDefault(Validator $validator)
    {
		$validator
			->alphaNumeric('login_account');

        return $validator;
    }
}