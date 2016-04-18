<?php
namespace Fixture\Service;


/**
 * Data fixture utility service to enable easy setup of test data.
 * @author gerard.brown
 */
class Fixture
{

	/**
	 * @var \Doctrine\ORM\EntityManager
	 */
	static protected $em;
	/**
	 * @var array
	 */
	static protected $references = array();
	/**
	 * @var array
	 */
	static protected $referenceIds = array();


	/**
	 * Set Doctrine Entity Manager.
	 * @param \Doctrine\ORM\EntityManager $em
	 */
	static public function setEntityManager(\Doctrine\ORM\EntityManager $em)
	{
		self::$em = $em;
	}

	/**
	 * Add multiple entries.
	 * @param string $entityName
	 * @param array  $stackData
	 */
	static protected function addStack($entityName, array $stackData)
	{
		foreach ($stackData as $key => $data)
		{
			$referenceName = !is_numeric($key)
				? $key
				: false;
			self::addEntry($entityName, $data, $referenceName);
		}
	}

	/**
	 * Add a single entry.
	 * @param string $entityName
	 * @param array  $data
	 * @param string $referenceName
	 */
	static protected function addEntry($entityName, array $data, $referenceName = '')
	{
		$entity = new $entityName();
		$entity->fromArray($data);
		self::$em->persist($entity);
		self::$em->flush();
		if ('' !== $referenceName)
		{
			self::$referenceIds[$referenceName] = $entity->id;
			self::$references[$referenceName]   = self::$em->getReference($entityName, $entity->id);
		}
	}

	/**
	 * Retrieve a reference.
	 * @param string $name
	 * @return object|null
	 */
	static protected function getReference($name)
	{
		self::$em->merge(self::$references[$name]);
		return self::$references[$name];
	}

	/**
	 * Retrieve a reference.
	 * @param string $name
	 * @return object|null
	 */
	static protected function getReferenceId($name)
	{
		self::$em->merge(self::$references[$name]);
		return self::$referenceIds[$name];
	}

}
