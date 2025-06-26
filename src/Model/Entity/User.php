<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * User Entity
 *
 * @property int    	$id
 * @property string 	$account
 * @property string 	$password
 * @property string 	$family_name
 * @property string 	$first_name
 * @property string 	$age
 * @property int    	$authority
 */
class User extends Entity
{
    protected $_accessible = [
        '*' => true,
        'id' => false
    ];
}
