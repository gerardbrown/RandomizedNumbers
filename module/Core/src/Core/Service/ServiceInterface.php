<?php
namespace Core\Service;


/**
 * Interface ServiceInterface: Standard interface for all public services.
 * @package Core\Service
 * @author  gerard.brown
 */
interface ServiceInterface
{

	/**
	 * Retrieve list of available public tasks for the service.
	 * @return array
	 */
	public function getTaskList();

	/**
	 * Retrieve task input meta data for publication / validation.
	 * @param string $taskName
	 * @return array
	 */
	public function getTaskRequirements($taskName);

	/**
	 * @param       $taskName
	 * @param array $data
	 * @return \Core\Service\Response
	 */
	public function executeTask($taskName, array $data);

}