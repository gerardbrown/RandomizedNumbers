<?php
namespace Profile\Fixture;

class Profile extends \Fixture\Service\Fixture
{

	/**
	 * Build profile fixtures.
	 */
	static public function build()
	{
		parent::addStack(
			'\Profile\Entity\Profile',
			array(
				array(
					'username'   => 'bob.somebody',
					'password'   => '12345678',
					'firstName'  => 'Bob',
					'familyName' => 'Somebody',
					'email'      => 'bob@abc.com',
					'mobile'     => '+27821234567',
					'userType'   => 'Administrator'
				)
			)
		);

	}

}