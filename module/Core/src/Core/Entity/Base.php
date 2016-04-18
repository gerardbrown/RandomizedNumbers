<?php
namespace Core\Entity;


/**
 * Basic Doctrine Entity functionality extension.
 */
class Base
{

	/* ------------------------------ Field allocations for automatic handling --------------------------- */
	/*
	 * Fields listed here are not allowed to be updated from array.
	 */
	protected $calculatedFields = array();
	/*
	 * Basic no-hassle fields like string, ints, bools, etc
	 */
	protected $basicFields = array();
	/*
	 * Date fields
	 */
	protected $dateFields = array();
	/*
	 * DateTime fields
	 */
	protected $dateTimeFields = array();
	/*
	 * Reference fields
	 */
	protected $referenceFields = array();



	/**
	 * Retrieve record id.
	 * @return integer
	 */
	public function getId()
	{
		return $this->id;
	}

	/**
	 * Magic getter to expose protected properties.
	 * @param string $property
	 * @return mixed
	 */
	public function __get($property)
	{
		return $this->$property;
	}

	/**
	 * Magic setter to save protected properties.
	 * @param string $property
	 * @param mixed  $value
	 */
	public function __set($property, $value)
	{
		$this->$property = $value;
	}

	/**
	 * Convert the object to an array.
	 * @param array $intersect
	 * @param array $expand
	 * @param bool  $showIdentifiers
	 * @param bool  $keepDateObjects
	 * @return array
	 */
	public function toArray(
		array $intersect = array(), array $expand = array(), $showIdentifiers = false, $keepDateObjects = false
	)
	{
		$intersect      = array_flip($intersect);
		$dateFormat     = 'Y-m-d';
		$dateTimeFormat = 'Y-m-d H:i:s';
		$includeAll     = empty($intersect);
		$data           = array();

		($includeAll || isset($intersect['id']))
		&& $data['id'] = $this->id;
		isset($this->archived)
		&& ($includeAll || isset($intersect['archived']))
		&& $data['archived'] = $this->archived;
		foreach ($this->basicFields as $field)
		{
			($includeAll || isset($intersect[$field]))
			&& $data[$field] = $this->$field;
		}
		foreach ($this->dateFields as $field)
		{
			($includeAll || isset($intersect[$field]))
			&& $data[$field] = !is_null($this->$field) && is_object($this->$field)
				? ($keepDateObjects
					? $this->$field
					: $this->$field->format($dateFormat))
				: null;
		}
		foreach ($this->dateTimeFields as $field)
		{
			($includeAll || isset($intersect[$field]))
			&& $data[$field] = !is_null($this->$field) && is_object($this->$field)
				? ($keepDateObjects
					? $this->$field
					: $this->$field->format($dateTimeFormat))
				: null;
		}
		foreach ($this->referenceFields as $field => $entityClass)
		{
			($includeAll || isset($intersect[$field]))
			&& $data[$field] = (in_array($field, $expand) || isset($expand[$field]) || $showIdentifiers)
			                   && !is_null($this->$field)
				? (!$showIdentifiers || in_array($field, $expand) || isset($expand[$field]) ? $this->$field->toArray(
					$intersect, (isset($expand[$field]) ? $expand[$field] : $expand), $showIdentifiers
				) : $this->$field->getId())
				: null;
		}

		return $data;
	}

	/**
	 * Populate from an array.
	 * @param array   $data
	 * @param boolean $rebuild
	 */
	public function fromArray($data = array(), $rebuild = false)
	{
		if (!$rebuild && isset($data['id']))
		{
			unset($data['id']);
		}
		foreach ($this->basicFields as $field)
		{
			($rebuild || !in_array($field, $this->calculatedFields))
			&& array_key_exists($field, $data)
			&& $this->$field = $data[$field];
		}
		foreach ($this->dateFields as $field)
		{
			if (($rebuild || !in_array($field, $this->calculatedFields))
			    && array_key_exists($field, $data)
			)
			{
				$this->$field = is_object($data[$field])
					? $data[$field]
					: (!empty($data[$field])
						? new \DateTime($data[$field])
						: null);
			}
		}
		foreach ($this->dateTimeFields as $field)
		{
			if (($rebuild || !in_array($field, $this->calculatedFields))
			    && array_key_exists($field, $data)
			)
			{
				$this->$field = is_object($data[$field])
					? $data[$field]
					: (!empty($data[$field])
						? new \DateTime($data[$field])
						: null);
			}
		}
		foreach ($this->referenceFields as $field => $entityClass)
		{
			if (($rebuild || !in_array($field, $this->calculatedFields))
			    && array_key_exists($field, $data)
			)
			{
				$this->$field = !$rebuild && is_object($data[$field])
					? $data[$field]
					: (!is_null($data[$field])
						? \Registry::getEntityManager()->getReference(
							$entityClass, $data[$field]
						)
						: null);
			}
		}
	}

}