<?php


/**
 * Registry for objects we want to have globally available.
 * @author gerard.brown
 *
 */
class Session
{

	/**
	 * @var \Zend\Session\Container
	 */
	static protected $session;




	/**
	 * Initiate session container.
	 */
	static protected function initSession()
	{
		is_null(self::$session)
		&& self::$session = new \Zend\Session\Container(__CLASS__);
	}

	/**
	 * Clear grid data stored in session.
	 * @return boolean
	 */
	static public function clearSession()
	{
		self::initSession();
		if (isset(self::$session->authData))
		{
			unset(self::$session->authData);
		}
		return true;
	}

	/**
	 * Check if we have authentication data.
	 * @return boolean
	 */
	static public function isAuthenticated()
	{
		self::initSession();
		return isset(self::$session->authData);
	}

	/**
	 * Set authentication data in session for global accessibility.
	 * @param array $authData
	 * @return boolean
	 */
	static public function setAuthData(array $authData)
	{
		self::initSession();
		self::$session->authData = $authData;
		return true;
	}

	/**
	 * Retrieve userType of authenticated user.
	 * @return string
	 */
	static public function getUserType()
	{
		self::initSession();
		return isset(self::$session->authData) && isset(self::$session->authData['userType'])
			? self::$session->authData['userType']
			: 'Guest';
	}

	/**
	 * Retrieve authentication data.
	 * @return array|null
	 */
	static public function getAuthData()
	{
		self::initSession();
		return isset(self::$session->authData)
			? self::$session->authData
			: null;
	}



}