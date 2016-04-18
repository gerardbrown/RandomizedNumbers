<?php


//-- List of validation types.
return array(

	'Date'             => array(
		'Validate' => array(
			array(
				'Class'   => 'Date',
				'Options' => array(
					'format' => 'Y-m-d'
				)
			)
		),
		'Options'  => array(
			'AllowEmpty' => false,
			'AllowZero'  => false,
			'AllowNull'  => false,
			'Unique'     => false
		),
		'Filter'   => array(),
		'Display'  => array()
	),

	'DateTime'         => array(
		'Validate' => array(
			array(
				'Class'   => 'Date',
				'Options' => array(
					'format' => 'Y-m-d H:i:s'
				)
			)
		),
		'Options'  => array(
			'AllowEmpty' => false,
			'AllowZero'  => false,
			'AllowNull'  => false,
			'Unique'     => false
		),
		'Filter'   => array(),
		'Display'  => array()
	),

	'Email'            => array(
		'Validate' => array(
			array(
				'Class'   => 'EmailAddress',
				'Options' => array()
			),
			array(
				'Class'   => 'StringLength',
				'Options' => array(
					'max' => 255
				)
			)
		),
		'Options'  => array(
			'AllowEmpty' => false,
			'AllowZero'  => false,
			'AllowNull'  => false,
			'Unique'     => false
		),
		'Filter'   => array(),
		'Display'  => array()
	),

	/* Specialized field types */
	'Id'               => array(
		'Validate' => array(
			array(
				'Class'   => 'Between',
				'Options' => array(
					'min' => 1
				)
			)
		),
		'Options'  => array(
			'AllowEmpty' => false,
			'AllowZero'  => false,
			'AllowNull'  => false,
			'Unique'     => false
		),
		'Filter'   => array(),
		'Display'  => array(
			'type' => 'hidden'
		)
	),

	'IdNullable'       => array(
		'Validate' => array(),
		'Options'  => array(
			'AllowEmpty' => false,
			'AllowZero'  => false,
			'AllowNull'  => true,
			'Unique'     => false
		),
		'Filter'   => array(),
		'Display'  => array(
			'type' => 'hidden'
		)
	),

	'Boolean'          => array(
		'Validate' => array(
			array(
				'Class'   => 'InArray',
				'Options' => array(
					'haystack' => array(0, 1, '0', '1', false, true)
				)
			)
		),
		'Options'  => array(
			'AllowEmpty' => false,
			'AllowZero'  => true,
			'AllowNull'  => false,
			'Unique'     => false
		),
		'Filter'   => array(),
		'Display'  => array(
			'type' => 'hidden'
		)
	),

	'UserType'         => array(
		'Validate' => array(
			array(
				'Class'   => 'InArray',
				'Options' => array(
					'haystack' => array('User', 'Administrator')
				)
			)
		),
		'Options'  => array(
			'AllowEmpty' => false,
			'AllowZero'  => false,
			'AllowNull'  => false,
			'Unique'     => false
		),
		'Filter'   => array(),
		'Display'  => array(
			'type' => 'hidden'
		)
	),

	'Username'         => array(
		'Validate' => array(
			array(
				'Class'   => 'StringLength',
				'Options' => array(
					'min' => 8,
					'max' => 25
				)
			)
		),
		'Options'  => array(
			'AllowEmpty' => false,
			'AllowZero'  => false,
			'AllowNull'  => false,
			'Unique'     => true
		),
		'Filter'   => array(),
		'Display'  => array()
	),

	'Password'         => array(
		'Validate' => array(
			array(
				'Class'   => 'StringLength',
				'Options' => array(
					'min' => 8,
					'max' => 50
				)
			)
		),
		'Options'  => array(
			'AllowEmpty' => false,
			'AllowZero'  => false,
			'AllowNull'  => false,
			'Unique'     => false
		),
		'Filter'   => array(),
		'Display'  => array(
			'type' => 'password'
		)
	),

	'IdNumber'         => array(
		'Validate' => array(
			array(
				'Class'   => 'Digits',
				'Options' => array()
			),
			array(
				'Class'   => 'StringLength',
				'Options' => array(
					'min' => 13,
					'max' => 13
				)
			)
		),
		'Options'  => array(
			'AllowEmpty' => true,
			'AllowZero'  => false,
			'AllowNull'  => false,
			'Unique'     => false
		),
		'Filter'   => array(),
		'Display'  => array()
	),

	'Name'             => array(
		'Validate' => array(
			array(
				'Class'   => 'Regex',
				'Options' => array(
					'pattern' => '/[a-zA-Z0-9]*/'
				)
			),
			array(
				'Class'   => 'StringLength',
				'Options' => array(
					'max' => 100
				)
			)
		),
		'Options'  => array(
			'AllowEmpty' => false,
			'AllowZero'  => false,
			'AllowNull'  => false,
			'Unique'     => false
		),
		'Filter'   => array(),
		'Display'  => array()
	),

	'PersonName'       => array(
		'Validate' => array(
			array(
				'Class'   => 'Regex',
				'Options' => array(
					'pattern' => '/[a-zA-Z]*/'
				)
			),
			array(
				'Class'   => 'StringLength',
				'Options' => array(
					'max' => 150
				)
			)
		),
		'Options'  => array(
			'AllowEmpty' => false,
			'AllowZero'  => false,
			'AllowNull'  => false,
			'Unique'     => false
		),
		'Filter'   => array(),
		'Display'  => array()
	),

	'Decimal'          => array(
		'Validate' => array(
			array(
				'I18nClass' => 'Float',
				'Options'   => array()
			)
		),
		'Options'  => array(
			'AllowEmpty' => false,
			'AllowZero'  => true,
			'AllowNull'  => false,
			'Unique'     => false
		),
		'Filter'   => array(),
		'Display'  => array()
	),

	'Integer'          => array(
		'Validate' => array(
			array(
				'Class'   => 'Digits',
				'Options' => array()
			)
		),
		'Options'  => array(
			'AllowEmpty' => false,
			'AllowZero'  => true,
			'AllowNull'  => false,
			'Unique'     => false
		),
		'Filter'   => array(),
		'Display'  => array()
	),

	'Digit'          => array(
		'Validate' => array(
			array(
				'Class'   => 'Digits',
				'Options' => array()
			)
		),
		'Options'  => array(
			'AllowEmpty' => false,
			'AllowZero'  => true,
			'AllowNull'  => false,
			'Unique'     => false
		),
		'Filter'   => array(),
		'Display'  => array()
	),

	'String25'         => array(
		'Validate' => array(
			array(
				'Class'   => 'StringLength',
				'Options' => array(
					'max' => 25
				)
			)
		),
		'Options'  => array(
			'AllowEmpty' => false,
			'AllowZero'  => false,
			'AllowNull'  => false,
			'Unique'     => false
		),
		'Filter'   => array(),
		'Display'  => array()
	),

	'String50'         => array(
		'Validate' => array(
			array(
				'Class'   => 'StringLength',
				'Options' => array(
					'max' => 50
				)
			)
		),
		'Options'  => array(
			'AllowEmpty' => false,
			'AllowZero'  => false,
			'AllowNull'  => false,
			'Unique'     => false
		),
		'Filter'   => array(),
		'Display'  => array()
	)

);