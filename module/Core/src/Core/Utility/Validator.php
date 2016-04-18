<?php
namespace Core\Utility;


/**
 * Input validation from meta-data.
 * @author gerard.brown
 */
class Validator
{

	/**
	 * @var array
	 */
	static protected $messages;


	/**
	 * Validate a set of inputs from validation meta-data.
	 * @param array $validation
	 * @param array $input
	 * @return boolean
	 */
	static public function validateInputSet(array $validation, array $input)
	{
		$valid          = true;
		self::$messages = array();
		foreach ($validation as $field => $chain)
		{
			if (!array_key_exists($field, $input))
			{
				continue;
			}
			$validatorChain = new \Zend\Validator\ValidatorChain();
			foreach ($chain['Validate'] as $validator)
			{
				$class = !isset($validator['I18nClass'])
					? '\\Zend\\Validator\\' . $validator['Class']
					: '\\Zend\\I18n\\Validator\\' . $validator['I18nClass'];
				$validatorChain->attach(new $class($validator['Options']));
			}
			if (!$validatorChain->isValid($input[$field]))
			{
				$valid = false;
				foreach ($validatorChain->getMessages() as $message)
				{
					self::$messages[$field][] = $message;
				}
			}
		}
		return $valid;
	}

	/**
	 * Retrieve validation error messages.
	 * @return array
	 */
	static public function getMessages()
	{
		return self::$messages;
	}

}
