<?php
namespace Core\Controller;


class ApiController extends \Zend\Mvc\Controller\AbstractActionController
{

	/**
	 * @var array
	 */
	protected $serviceList;
	/**
	 * @var array
	 */
	protected $request;



	/**
	 * Initialize.
	 */
	private function init()
	{
		//-- Make service manager available.
		\Registry::setServiceManager($this->serviceLocator);

		//-- Set json header.
		$this->getServiceLocator()->get('Application')->getEventManager()->attach(\Zend\Mvc\MvcEvent::EVENT_RENDER, function ($event)
		{
			$event->getResponse()->getHeaders()->addHeaderLine('Content-Type', 'application/json');
		}, -10000);

		//-- Get list of available services.
		$this->serviceList = include_once(getcwd() . '/config/api.config.php');

		//-- Get json post input.
		$this->request = json_decode(file_get_contents('php://input'), true);
	}

	/**
	 * Provide service list by default.
	 * @return \Zend\View\Model\JsonModel
	 */
	public function indexAction()
	{
		return new \Zend\View\Model\JsonModel($this->serviceList);
	}

	/**
	 * Retrieve list of services.
	 * @return \Zend\View\Model\JsonModel
	 */
	public function getServiceListAction()
	{
		return new \Zend\View\Model\JsonModel($this->serviceList);
	}

	/**
	 * Retrieve list of tasks for service.
	 * @return \Zend\View\Model\JsonModel
	 */
	public function getServiceTaskListAction()
	{
		$this->init();
		if (!isset($this->request['Service']))
		{
			//-- Require a service name parameter.
			$response = array(
				'Status'  => 'Error',
				'Message' => 'Please provide service name in root parameter `Service`',
				'Data'    => array()
			);
		}
		else if (!in_array($this->request['Service'], $this->serviceList))
		{
			//-- Require a valid service name.
			$response = array(
				'Status'  => 'Error',
				'Message' => 'Invalid `Service`.',
				'Data'    => array()
			);
		}
		else
		{
			//-- Retrieve list of available tasks for specified service.
			$service  = \Registry::getService($this->request['Service']);
			$response = $service->getTaskList();
		}
		return new \Zend\View\Model\JsonModel($response);
	}

	/**
	 * Execute a service task.
	 * @return \Zend\View\Model\JsonModel
	 */
	public function executeAction()
	{
		$this->init();
		if (!isset($this->request['Service'])
		    || !isset($this->request['Task'])
		    || !isset($this->request['Data'])
		    || !is_array($this->request['Data'])
		)
		{
			//-- Require a service name parameter.
			$response = array(
				'Status'  => 'Error',
				'Message' => 'Please provide parameters `Service`, `Task` and `Data`',
				'Data'    => array()
			);
		}
		else if (!in_array($this->request['Service'], $this->serviceList))
		{
			//-- Require a valid service name.
			$response = array(
				'Status'  => 'Error',
				'Message' => 'Invalid `Service`.',
				'Data'    => array()
			);
		}
		else
		{
			//-- Retrieve service.
			$service = \Registry::getService($this->request['Service']);

			//-- Validate.
			$requirements = $service->getTaskRequirements($this->request['Task']);
			$validationResponse = $this->validateServiceInput($requirements);
			if (is_object($validationResponse))
			{
				return $validationResponse;
			}

			//-- Execute requested task.
			try
			{
				$response = $service->executeTask($this->request['Task'], $this->request['Data']);
			}
			catch (\Exception $e)
			{
				$response = array(
					'Status'  => 'Error',
					'Message' => $e->getMessage(),
					'Data'    => array()
				);
			}
		}
		return new \Zend\View\Model\JsonModel(
			is_object($response)
				? $response->toArray()
				: $response
		);
	}

	/**
	 * Utility method to validate service input data.
	 * @param array $requirements
	 * @return bool|\Zend\View\Model\JsonModel
	 */
	protected function validateServiceInput(array $requirements)
	{
		//-- Authentication, filter input data, check for presence of required fields & collect validation meta data.
		if (isset($requirements['Authentication'])
		    && 0 < count($requirements['Authentication'])
		)
		{
			if (!in_array(\Session::getUserType(), $requirements['Authentication']))
			{
				//-- Authentication error.
				return new \Zend\View\Model\JsonModel(
					array(
						'Status'  => 'Error',
						'Message' => 'Authentication required for this task.',
						'Data'    => array()
					)
				);
			}
		}
		$validationConfig = include_once(getcwd() . '/config/validation.config.php');
		$requestData      = $this->request['Data'];
		$inputData        = array();
		$validationMeta   = array();
		if (isset($requirements['RequiredParameters'])
		    && 0 < count($requirements['RequiredParameters'])
		)
		{
			$requirementMessages = array();
			foreach ($requirements['RequiredParameters'] as $fieldName => $validationType)
			{
				//-- Check that field was passed.
				if (!array_key_exists($fieldName, $requestData))
				{
					$requirementMessages[$fieldName] = 'This field is required.';
				}
				if (!isset($validationConfig[$validationType]))
				{
					$requirementMessages[$fieldName] = 'Invalid validation type specified: `' . $validationType . '`';
					continue;
				}
				$validationMeta[$fieldName] = $validationConfig[$validationType];
				if (array_key_exists($fieldName, $requestData))
				{
					$inputData[$fieldName] = $requestData[$fieldName];
				}
			}
			if (0 < count($requirementMessages))
			{
				return new \Zend\View\Model\JsonModel(
					array(
						'Status'  => 'Error',
						'Message' => 'Required parameters not provided.',
						'Data'    => $requirementMessages
					)
				);
			}
		}
		if (isset($requirements['OptionalParameters'])
		    && 0 < count($requirements['OptionalParameters'])
		)
		{
			foreach ($requirements['OptionalParameters'] as $fieldName => $validationType)
			{
				if (!isset($validationConfig[$validationType]))
				{
					$requirementMessages[$fieldName] = 'Invalid validation type specified: `' . $validationType . '`';
					continue;
				}
				$validationMeta[$fieldName] = $validationConfig[$validationType];
				if (array_key_exists($fieldName, $requestData))
				{
					$inputData[$fieldName] = $requestData[$fieldName];
				}
			}
		}

		//-- Run validation.
		if (!\Core\Utility\Validator::validateInputSet($validationMeta, $inputData))
		{
			return new \Zend\View\Model\JsonModel(
				array(
					'Status'  => 'Error',
					'Message' => 'Input validation errors.',
					'Data'    => \Core\Utility\Validator::getMessages()
				)
			);
		}

		//-- All good.
		return true;
	}

}