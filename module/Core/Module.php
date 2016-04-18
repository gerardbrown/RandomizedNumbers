<?php
namespace Core;


class Module
{

	public function getAutoloaderConfig()
	{
		return array(
			'Zend\Loader\ClassMapAutoloader' => array(
				__DIR__ . '/autoload_classmap.php',
			)
		);
	}

	public function getConfig()
	{
		return include __DIR__ . '/config/module.config.php';
	}

	public function getServiceConfig()
	{
		return array(
			'invokables' => array(
				__NAMESPACE__                              => __NAMESPACE__ . '\Workflow',
				__NAMESPACE__ . '.Service.Profile'         => __NAMESPACE__ . '\Service\Profile',
				__NAMESPACE__ . '.Service.Registration'    => __NAMESPACE__ . '\Service\Registration'
			)
		);
	}

}