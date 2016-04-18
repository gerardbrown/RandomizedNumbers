<?php
//-- Default Timezone.
date_default_timezone_set('Africa/Johannesburg');


//-- Configuration.
$globalConfig = include_once 'config/autoload/global.php';
$globalConfig = $globalConfig['doctrine']['connection']['orm_default']['params'];
$localConfig  = include_once 'config/autoload/local.php';
$localConfig  = $localConfig['doctrine']['connection']['orm_default']['params'];


//-- Entity Manager.
use Doctrine\ORM\Tools\Setup;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\Configuration;
use Doctrine\ORM\Mapping\Driver\AnnotationDriver;
use Doctrine\Common\Annotations\AnnotationReader;

$isDevMode = true;
$config    = Setup::createAnnotationMetadataConfiguration(
	array(),
	$isDevMode
);
$baseDir   = getcwd();
include_once 'module/Core/src/Core/Entity/Base.php';
$driver = new AnnotationDriver(
	new Doctrine\Common\Annotations\AnnotationReader(),
	array(
		"$baseDir/module/Profile/src/Profile/Entity",
        "$baseDir/module/Randomizer/src/Randomizer/Entity",
        "$baseDir/module/WinningNumbers/src/WinningNumbers/Entity"
	)
);
$config->setMetadataDriverImpl($driver);
$conn          = array(
	'driver'   => 'pdo_mysql',
	'host'     => $globalConfig['host'],
	'port'     => $globalConfig['port'],
	'user'     => $localConfig['user'],
	'password' => $localConfig['password'],
	'dbname'   => $localConfig['dbname'],
	'charset'  => $globalConfig['charset']
);
$entityManager = EntityManager::create($conn, $config);


//-- Helper Set.
$helperSet = new \Symfony\Component\Console\Helper\HelperSet(
	array(
		'em' => new \Doctrine\ORM\Tools\Console\Helper\EntityManagerHelper($entityManager)
	)
);

return $helperSet;