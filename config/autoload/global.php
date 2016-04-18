<?php
/**
 * Global Configuration Override
 */

return array(
    'DocumentUrl'  => 'http://randomizer.local/documents/',
    'DocumentPath'   => __DIR__ . '/../../public/documents/',
	'doctrine' => array(
		'connection' => array(
			'orm_default' => array(
				'driverClass' => 'Doctrine\DBAL\Driver\PDOMySql\Driver',
				'params' => array(
					'host'     => 'localhost',
					'port'     => '3306',
					'charset'  => 'UTF8'
				)
			)
		)
	)
);
