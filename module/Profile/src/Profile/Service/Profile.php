<?php
namespace Profile\Service;


class Profile extends \Core\Service\Base implements \Core\Service\ServiceInterface
{


	// ----------------------- SERVICE DEFINITION
	/**
	 * @var array
	 */
	protected $meta = array(
		'Entity'  => 'Profile\\Entity\\Profile',
		'Actions' => array(
			//-- Authentication
			'Authenticate'         => array(
				'Authentication'     => array(),
				'Description'        => 'Authenticate user.',
				'RequiredParameters' => array(
					'username' => 'Username',
					'password' => 'Password'
				),
				'OptionalParameters' => array()
			),
			'Logout'               => array(
				'Authentication'     => array(),
				'Description'        => 'Log user out of system.',
				'RequiredParameters' => array(),
				'OptionalParameters' => array()
			),
			//-- Session data
			'GetAuthenticatedUser' => array(
				'Authentication'     => array(),
				'Description'        => 'Retrieve user data for authenticated user.',
				'RequiredParameters' => array(),
				'OptionalParameters' => array()
			)
		)
	);


	// ----------------------- SERVICE ACTIONS
	/**
	 * Authenticate user.
	 * @param array $data
	 * @return \Core\Service\Response
	 */
	protected function actionAuthenticate(array $data)
	{
		//-- If login is being attempted ensure session is clean.
		\Session::clearSession();

		//-- See if we can find the user.
		$profile = $this->dataFind(
			array(
				'username' => $data['username']
			)
		);

		//-- Check if we have a user and a valid password.
		if (is_null($profile) || !$profile->passwordValid($data['password']))
		{
			//-- Invalid authentication, respond.
			return $this->response->error('Invalid authentication details.');
		}

		//-- Put together authentication data.
		$authenticationData = $profile->toArray(
			array(
				'id',
				'username',
				'fullName',
				'email',
				'userType'
			)
		);

		//-- Store authentication data to session.
		\Session::setAuthData($authenticationData);

		//-- Respond.
		return $this->response->success($authenticationData);
	}

	/**
	 * Log user out of system.
	 * @param array $data
	 * @return \Core\Service\Response
	 */
	protected function actionLogout(array $data)
	{
		//-- If login is being attempted ensure session is clean.
		\Session::clearSession();

		//-- Respond.
		return $this->response->success();
	}

	/**
	 * Retrieve authentication data for logged in user.
	 * @param array $data
	 * @return \Core\Service\Response
	 */
	protected function actionGetAuthenticatedUser(array $data)
	{
		//-- Respond.
		return \Session::isAuthenticated()
			? $this->response->success(\Session::getAuthData())
			: $this->response->error('Invalid session.');
	}


}