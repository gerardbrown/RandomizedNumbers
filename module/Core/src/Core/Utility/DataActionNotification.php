<?php
namespace Core\Utility;


class DataActionNotification
{

	/**
	 * @var array
	 */
	static protected $config;


	/**
	 * Retrieve configuration.
	 */
	static protected function getConfig()
	{
		if (is_null(self::$config))
		{
			self::$config = include_once(getcwd() . '/config/data-action-notification.config.php');
		}
	}

	/**
	 * Triggered on creation of entry in \Core\Service\Base
	 * @param string            $entityClass
	 * @param \Core\Entity\Base $record
	 */
	static public function onCreate($entityClass, \Core\Entity\Base $record)
	{
		//-- Check for potential triggers.
		self::getConfig();
		if (!isset(self::$config['Create'][$entityClass]))
		{
			return;
		}

		//-- Evaluate triggers.
		self::checkTriggers('Create', $entityClass, $record);
	}

	/**
	 * Triggered on updating of entry in \Core\Service\Base
	 * @param string            $entityClass
	 * @param \Core\Entity\Base $record
	 */
	static public function onUpdate($entityClass, \Core\Entity\Base $record)
	{
		//-- Check for potential triggers.
		self::getConfig();
		if (!isset(self::$config['Update'][$entityClass]))
		{
			return;
		}

		//-- Evaluate triggers.
		self::checkTriggers('Update', $entityClass, $record);
	}

	/**
	 * Triggered on deletion of entry in \Core\Service\Base
	 * @param string            $entityClass
	 * @param \Core\Entity\Base $record
	 */
	static public function onDelete($entityClass, \Core\Entity\Base $record)
	{
		//-- Check for potential triggers.
		self::getConfig();
		if (!isset(self::$config['Delete'][$entityClass]))
		{
			return;
		}

		//-- Evaluate triggers.
		self::checkTriggers('Delete', $entityClass, $record);
	}

	/**
	 * @param string            $dataAction
	 * @param string            $entityClass
	 * @param \Core\Entity\Base $record
	 */
	static protected function checkTriggers($dataAction, $entityClass, \Core\Entity\Base $record)
	{
		//-- Evaluate triggers.
		foreach (self::$config[$dataAction][$entityClass] as $trigger)
		{
			//-- Check confition.
			if (isset($trigger['Condition']))
			{
				if (false === strpos($trigger['Condition']['field'], '.'))
				{
					$fieldName  = $trigger['Condition']['field'];
					$fieldValue = $record->$fieldName;
				}
				else
				{
					list($reference, $fieldName) = explode('.', $trigger['Condition']['field']);
					$fieldValue = $record->$reference->$fieldName;
				}
				$value = $trigger['Condition']['value'];
				switch ($trigger['Condition']['operator'])
				{
					case '=':
						$match = $fieldValue == $value;
						break;
					case '<':
						$match = $fieldValue < $value;
						break;
					case '>':
						$match = $fieldValue > $value;
						break;
					default:
						continue;
				}
			}
			else
			{
				$match = true;
			}
			if (!$match)
			{
				continue;
			}

			//-- Do action.
			$method = 'action' . $trigger['Action'];
			call_user_func_array(array('\Core\Utility\DataActionNotification', $method), array($trigger['Options'], $record));
		}
	}

	/**
	 * Send an email.
	 * @param array             $options
	 * @param \Core\Entity\Base $record
	 */
	static protected function actionSendEmail(array $options, \Core\Entity\Base $record)
	{
		//-- Collect data.
		$fieldData = array();
		foreach ($options['fields'] as $fieldName => $label)
		{
			if (!is_array($label))
			{
				$fieldData[$label] = $record->$fieldName;
			}
			else
			{
				foreach ($label as $subFieldName => $subLabel)
				{
					$fieldData[$subLabel] = $record->$fieldName->$subFieldName;
				}
			}
		}

		//-- Put email together.
		$body = '<b>' . $options['title'] . '</b><br/><br/>';
		foreach ($fieldData as $label => $value)
		{
			$body .= '<b>' . $label . ':</b> <i>' . $value . '</i><br/>';
		}
		$body .= '<br/>';

		//-- Send email.
		$email = new \Core\Comms\Email();
		$email->send(
			array(
				'From'    => $options['from'],
				'To'      => $options['email'],
				'Subject' => $options['subject'],
				'Html'    => $body
			)
		);
	}

}