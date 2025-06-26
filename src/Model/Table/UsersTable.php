<?php
namespace App\Model\Table;

use Cake\Validation\Validator;

/**
 * Users Model
 *
 * @method \App\Model\Entity\User get($primaryKey, $options = [])
 * @method \App\Model\Entity\User newEntity($data = null, array $options = [])
 * @method \App\Model\Entity\User[] newEntities(array $data, array $options = [])
 * @method \App\Model\Entity\User|bool save(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\User patchEntity(\Cake\Datasource\EntityInterface $entity, array $data, array $options = [])
 * @method \App\Model\Entity\User[] patchEntities($entities, array $data, array $options = [])
 * @method \App\Model\Entity\User findOrCreate($search, callable $callback = null)
 */
class UsersTable extends BaseTable
{
    /**
     * @param array $config
     * @throws \Exception
     */
    public function initialize(array $config)
    {
        parent::initialize($config);
        $this->displayField('id');
        $this->primaryKey('id');
    }

	/**
	 * ログインしたユーザーを取得する。
	 * @param string $account
	 * @param string $password
	 * @return User
	 */
	public function getOneByLogin($account, $password)
	{
		return $this->find()
			->where([
				'account'  => $account,
				'password' => $password,
			])
			->first();
	}

    // /**
    //  * @return \App\Model\Entity\User
    //  */
    // public function getByEmailAndPassword($email, $password)
    // {
    //     $where = [
    //         'email' => $email,
    //         'password' => $password,
    //     ];
    //     $user = $this->find()->where($where)->first();

    //     return $user;
    // }
}
