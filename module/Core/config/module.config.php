<?php
namespace Core;

return array(
	'doctrine'     => array(
		'driver' => array(
			__NAMESPACE__ . '_driver' => array(
				'class' => 'Doctrine\ORM\Mapping\Driver\AnnotationDriver',
				'cache' => 'array',
				'paths' => array(__DIR__ . '/../src/' . __NAMESPACE__ . '/Entity')
			),
			'orm_default'             => array(
				'drivers' => array(
					__NAMESPACE__ . '\Entity' => __NAMESPACE__ . '_driver'
				)
			)
		)
	),
	'controllers'  => array(
		'invokables' => array(
			'Core\Controller\Api' => 'Core\Controller\ApiController'
		),
	),
	'router'       => array(
		'routes' => array(
			'api' => array(
				'type'    => 'segment',
				'options' => array(
					'route'       => '/api/v1[/][:action]',
					'constraints' => array(
						'action' => '[a-zA-Z][a-zA-Z0-9_-]*'
					),
					'defaults'    => array(
						'controller' => 'Core\Controller\Api',
						'action'     => 'index',
					),
				),
			)
		),
	),
	'view_manager' => array(
		'template_path_stack' => array(
			'workspace' => __DIR__ . '/../view',
		),
		'strategies' => array(
			'ViewJsonStrategy'
		)
	)
);