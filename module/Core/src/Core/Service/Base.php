<?php
namespace Core\Service;


/**
 * Basic data utilities to provide functionality to service layer.
 * @author gerard.brown
 */
class Base
{


	/**
	 * @var \Doctrine\ORM\EntityManager
	 */
	static protected $em;
	/**
	 * @var \Core\Service\Response
	 */
	protected $response;
	/**
	 * @var array
	 */
	protected $meta;



	/**
	 * @param \Doctrine\ORM\EntityManager $em
	 */
	public function __construct(\Doctrine\ORM\EntityManager $em)
	{
		$this->em = $em;
	}



	//------------------------- Default functionality for service interface
	/**
	 * Retrieve list of available public tasks for the service.
	 * @return array
	 */
	public function getTaskList()
	{
		return $this->meta['Actions'];
	}

	/**
	 * Retrieve task input meta data for publication / validation.
	 * @param string $taskName
	 * @return array
	 * @throws \Exception on invalid task requested
	 */
	public function getTaskRequirements($taskName)
	{
		if (!isset($this->meta['Actions'][$taskName]))
		{
			throw new \Exception('Invalid task requested');
		}
		return $this->meta['Actions'][$taskName];
	}

	/**
	 * @param       $taskName
	 * @param array $data
	 * @return \Core\Service\Response
	 */
	public function executeTask($taskName, array $data)
	{
		$this->response = new \Core\Service\Response();
		$methodName = 'action' . $taskName;
		return $this->$methodName($data);
	}




	//------------------------- Database functionality.
	/**
	 * List entries with optional filtering.
	 * @param array $fields
	 * @param array $criteria
	 * @param array $orderBy
	 * @return array
	 */
	protected function dataDataList(array $fields, array $criteria = array(), $orderBy = array())
	{
		//-- Collect entries.
		$records = $this->em->getRepository($this->meta['Entity'])
			->findBy($criteria, $orderBy);

		//-- Cleanup.
		foreach ($records as $rowId => $record)
		{
			$records[$rowId] = $record->toArray($fields, array(), true, false);
		}

		//-- Done.
		return $records;
	}

	/**
	 * List entries in id => label format with optional filtering.
	 * @param string $labelFormat
	 * @param array  $labelFields
	 * @param array  $criteria
	 * @return array
	 */
	protected function dataSelectList($labelFormat, array $labelFields, array $criteria = array())
	{
		//-- Collect entries.
		foreach ($criteria as $field => $value)
		{
			if (is_array($value))
			{
				$criteria[$field] = 'IN ' . implode(',', $value);
			}
		}
		$orderBy = array();
		if (isset($labelFields[0]))
		{
			$orderBy['c.' . $labelFields[0]] = 'ASC';
		}

		$where   = \Core\Utility\Doctrine::dqlFilter($criteria, 'c');
		$orderBy = \Core\Utility\Doctrine::dqlOrder($orderBy);
		$query   = $this->em->createQuery(
			'SELECT c FROM ' . $this->meta['Entity'] . ' c ' . $where['Where'] . ' ' . $orderBy
		);

		if (count($where['Params']) > 0)
		{
			$query->setParameters($where['Params']);
		}
		$records = $query->getResult();

		//-- Cleanup.
		$search = array();
		foreach ($labelFields as $key => $fieldName)
		{
			!is_numeric($key)
			&& $fieldName = $key;
			$search[] = '[' . $fieldName . ']';
		}
		$data = array();

		//-- Build list.
		$dateTimeFormat = 'Y-m-d H:i:s';
		foreach ($records as $rowId => $record)
		{
			$replace = array();
			$i       = 0;
			foreach ($labelFields as $key => $fieldName)
			{
				$replace[] = !is_numeric($key)
					? (!is_null($record->$key) ? $record->$key->$fieldName : $fieldName)
					: $record->$fieldName;
				if (is_object($replace[$i]))
				{
					$replace[$i] = $replace[$i]->format($dateTimeFormat);
				}
				$i++;
			}
			$data[] = array(
				'value' => $record->id,
				'label' => str_replace(
					$search, $replace,
					$labelFormat
				)
			);
			unset($records[$rowId]);
		}

		//-- Done.
		return $data;
	}

	/**
	 * Retrieve data count
	 * @param array $filter
	 * @return array
	 */
	protected function dataCount(array $filter = array())
	{
		//-- Establish size of dataset.
		$entity = $this->meta['Entity'];
		$where  = \Core\Utility\Doctrine::dqlFilter($filter, 'c');
		$query  = "SELECT COUNT(DISTINCT c.id) AS total FROM $entity c " . $where['Where'];
		$query  = $this->em->createQuery($query);
		!empty($where['Params'])
		&& $query->setParameters($where['Params']);
		$numRecsRes = $query->getSingleResult();
		$numRecs    = (int)$numRecsRes['total'];

		//-- All done.
		return array(
			'NumberOfRecords' => $numRecs
		);
	}

	/**
	 * Retrieve data grid from provided query.
	 * The DQL query should contain [WHERE] and [ORDER] for relevant hydration.
	 * Filtering allows for smart filtering: 'profile.firstName' => '!NULL'.
	 * numberOfRecords AND page must be greater than 0 to collect a paged data-set.
	 *
	 * @param string  $dql
	 * @param string  $selection
	 * @param integer $numberOfRecords
	 * @param integer $page
	 * @param array   $filter
	 * @param array   $order
	 * @param string  $group
	 * @param array   $fields
	 * @param string  $baseTable
	 * @param string  $swap
	 * @return array
	 */
	protected function dataGrid($dql, $selection, $numberOfRecords, $page,
	                            array $filter = array(), array $order = array(), $group = '',
	                            array $fields = array(), $baseTable = '', $swap = '')
	{
		//-- Establish size of data-set.
		!empty($group)
		&& $group = 'GROUP BY ' . $group;
		$where = \Core\Utility\Doctrine::dqlFilter($filter, $baseTable);
		$query = str_replace(
			array('[SELECTION]', '[WHERE]', '[ORDER]', '[GROUP]', '[SWAP]'),
			array("COUNT(DISTINCT $baseTable.id) AS total", $where['Where'], '', ''),
			$dql
		);
		$query = $this->em->createQuery($query);
		!empty($where['Params'])
		&& $query->setParameters($where['Params']);
		$numRecsRes = $query->getSingleResult();
		$numRecs    = (int)$numRecsRes['total'];
		if (0 == $numberOfRecords)
		{
			$numPages = (0 < $numRecs)
				? 1
				: 0;
		}
		else
		{
			$numPages = (0 < $numRecs)
				? ceil($numRecs / $numberOfRecords)
				: 0;
		}

		//-- Retrieve paged data-set.
		$query = str_replace(
			array('[SELECTION]', '[WHERE]', '[ORDER]', '[GROUP]', '[SWAP]'),
			array($selection, $where['Where'], \Core\Utility\Doctrine::dqlOrder($order), $group, $swap),
			$dql
		);
		$query = $this->em->createQuery($query);
		!empty($where['Params'])
		&& $query->setParameters($where['Params']);
		(0 < $numberOfRecords)
		&& $query->setMaxResults($numberOfRecords);
		(0 < $page && 0 < $numberOfRecords)
		&& $query->setFirstResult(($page - 1) * $numberOfRecords);
		return array(
			'Meta'    => array(
				'RecordsPerPage' => $numberOfRecords,
				'TotalRecords'   => $numRecs,
				'TotalPages'     => $numPages,
				'CurrentPage'    => $page,
				'Filters'        => $filter,
				'Order'          => $order
			),
			'DataSet' => \Core\Utility\Doctrine::extractData($fields, $query->getArrayResult())
		);
	}



	/**
	 * Collect entry data, typically for modification.
	 * @param array $criteria
	 * @param array $orderBy
	 * @return array
	 * @throws \Exception
	 */
	protected function dataFind(array $criteria, array $orderBy = null)
	{
		//-- Get some data.
		$record = $this->em->getRepository($this->meta['Entity'])
			->findOneBy($criteria, $orderBy);

		//-- Done.
		return $record;
	}

	/**
	 * Collect entry, typically for modification.
	 * @param integer $id
	 * @return array
	 * @throws \Exception
	 */
	protected function dataLoad($id)
	{
		//-- Safety checks.
		if (!is_numeric($id) || 0 == $id)
		{
			throw new \Exception('A valid record `id` is required.');
		}

		//-- Get some data.
		$record = $this->em->find($this->meta['Entity'], $id);
		if (is_null($record))
		{
			throw new \Exception('Could not find record.');
		}

		//-- Done.
		return $record;
	}

	/**
	 * Collect entry data.
	 * @param integer $id
	 * @param array $expand
	 * @return array
	 * @throws \Exception
	 */
	protected function dataCollect($id, array $expand = array())
	{
		//-- Safety checks.
		if (!is_numeric($id) || 0 == $id)
		{
			throw new \Exception('A valid record `id` is required.');
		}

		//-- Get some data.
		$record = $this->em->find($this->meta['Entity'], $id);
		if (is_null($record))
		{
			throw new \Exception('Could not find record.');
		}

		//-- Done.
		return $record->toArray(array(), $expand, true);
	}

	/**
	 * Create a new entry.
	 * @param array $data
	 * @return object
	 */
	protected function dataCreate(array $data)
	{
		//-- Create entry.
		$baseEntity = $this->meta['Entity'];
		$record     = new $baseEntity();
		$record->fromArray($data, false);
		$this->em->persist($record);
		$this->em->flush();
		\Core\Utility\DataActionNotification::onCreate($this->meta['Entity'], $record);
		return $record;
	}

	/**
	 * Update an entry.
	 * @param integer $id
	 * @param array   $data
	 * @return object
	 */
	protected function dataUpdate($id, array $data)
	{
		//-- Update entry.
		$record = $this->em->getRepository($this->meta['Entity'])
			->find($id);
		$record->fromArray($data, false, true);
		$this->em->flush();
		\Core\Utility\DataActionNotification::onUpdate($this->meta['Entity'], $record);
		return $record;
	}

	/**
	 * Delete an entry.
	 * @param integer $id
	 * @return boolean
	 */
	protected function dataDelete($id)
	{
		//-- Delete/Archive entry.
		$record = $this->em->find($this->meta['Entity'], $id);
		\Core\Utility\DataActionNotification::onDelete($this->meta['Entity'], $record);
		$this->em->remove($record);
		$this->em->flush();
		return true;
	}

}
