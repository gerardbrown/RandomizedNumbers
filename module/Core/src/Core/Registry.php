<?php



/**
 * Registry for objects we want to have globally available.
 * @author gerard.brown
 *
 */
class Registry
{

	/**
	 * @var \Zend\ServiceManager\ServiceLocatorInterface
	 */
	static protected $sm = null;
	/**
	 * @var \Doctrine\ORM\EntityManager
	 */
	static protected $em;



	/**
	 * Set Zend Service Manager & Doctrine Entity Manager for easy access.
	 * @param \Zend\ServiceManager\ServiceLocatorInterface $sm
	 * @return boolean
	 */
	static public function setServiceManager($sm)
	{
		self::$sm = $sm;
		self::$em = self::$sm->get('doctrine.entitymanager.orm_default');
		return true;
	}

	/**
	 * Retrieve Zend Service Manager.
	 * @return \Zend\ServiceManager\ServiceLocatorInterface
	 */
	static public function getServiceManager()
	{
		return self::$sm;
	}

	/**
	 * Retrieve Doctrine Entity Manager.
	 * @return \Doctrine\ORM\EntityManager
	 */
	static public function getEntityManager()
	{
		return self::$em;
	}

	/**
	 * Retrieve instantiation of specified service class.
	 * @param string $serviceName
	 * @return \Core\Service\ServiceInterface
	 */
	static public function getService($serviceName)
	{
		if (false !== strpos($serviceName, '.'))
		{
			list($module, $service) = explode('.', $serviceName);
		}
		else
		{
			$module  = $serviceName;
			$service = $serviceName;
		}
		$serviceClass = "$module\\Service\\$service";
		return new $serviceClass(self::$em);
	}


}