<?php
namespace Fixture;


return array(
	'controllers' => array(
		'invokables' => array(
			'Fixture\Controller\Fixture' => 'Fixture\Controller\FixtureController'
		),
	),
	'console'     => array(
		'router' => array(
			'routes' => array(
				'build'        => array(
					'options' => array(
						'route'    => 'fixture build',
						'defaults' => array(
							'controller' => 'Fixture\Controller\Fixture',
							'action'     => 'build'
						)
					)
				)
			)
		)
	)
);