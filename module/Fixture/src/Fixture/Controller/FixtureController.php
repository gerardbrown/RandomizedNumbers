<?php
namespace Fixture\Controller;


class FixtureController extends \Zend\Mvc\Controller\AbstractActionController
{

	/**
	 * Build fixtures.
	 */
	public function buildAction()
	{
		\Registry::setServiceManager($this->serviceLocator);
		\Fixture\Service\Fixture::setEntityManager(
			\Registry::getEntityManager()
		);
		$config = include(getcwd() . '/config/fixture.config.php');
		foreach ($config as $fixture)
		{
			echo "Building data for $fixture \n";
			$fixture::build();
		}
		return 'Done!' . "\n";
	}

}