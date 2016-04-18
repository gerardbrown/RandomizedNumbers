<?php
namespace Core\Utility;


/**
 * Some doctrine helper functionality.
 * @author gerard.brown
 */
class Doctrine
{

	/**
	 * Extract specified fields from a data-set.
	 * @param array $fields
	 * @param array $data
	 * @return array
	 */
	static public function extractData(array $fields, array $data)
	{
		#-> Short-circuit.
		if (empty($data) || empty($fields))
		{
			return $data;
		}

		#-> Find the data we have an interest in.
		$result = array();
		foreach ($data as $row)
		{
			if (isset($row[0]))
			{
				if (!isset($mergeMap))
				{
					$mergeMap = array();
					foreach ($row as $id => $nest)
					{
						is_numeric($id)
						&& $mergeMap[] = $id;
					}
				}
				foreach ($mergeMap as $id)
				{
					$row = array_merge($row, $row[$id]);
					unset($row[$id]);
				}
			}
			$result[] = self::extractDataFromRow($fields, $row);
		}

		#-> Fin.
		return $result;
	}

	/**
	 * Extract specified fields from a [nested] data row.
	 * @param array $fields
	 * @param array $row
	 * @return array
	 */
	static public function extractDataFromRow(array $fields, array $row)
	{
		$result = array();
		foreach ($fields as $key => $field)
		{
			if (is_array($field))
			{
				if (is_numeric($key))
				{
					$result[$key] = isset($row[$key])
						? self::extractData($field, $row)
						: array();
				}
				else
				{
					$result[$key] = isset($row[$key])
						? self::extractDataFromRow($field, $row[$key])
						: array();
				}
			}
			else
			{
				if (is_numeric($key))
				{
					$result[$field] = isset($row[$field])
						? $row[$field]
						: null;
				}
				else
				{
					if (!is_object($field))
					{
						switch ($field)
						{
							case 'DateTime':
								isset($dateTimeFormat)
								|| $dateTimeFormat = 'Y-m-d H:i:s';
								$result[$key] = isset($row[$key]) && is_object($row[$key])
									? $row[$key]->format($dateTimeFormat)
									: null;
								break;
							case 'Date':
								isset($dateFormat)
								|| $dateFormat = 'Y-m-d';
								$result[$key] = isset($row[$key]) && is_object($row[$key])
									? $row[$key]->format($dateFormat)
									: null;
								break;
							case 'Array':
								$result[$key] = isset($row[$key]) && !empty($row[$key]) && !is_array($row[$key])
									? unserialize($row[$key])
									: null;
								break;
							case 'JSON':
								$result[$key] = isset($row[$key]) && !empty($row[$key]) && !is_array($row[$key])
									? json_decode($row[$key])
									: null;
								break;
						}
					}
					elseif (is_callable($field))
					{
						$result[$key] = $field(isset($row[$key]) ? $row[$key] : null);
					}
				}
			}
		}
		return $result;
	}

	/**
	 * Build DQL order by string from array input.
	 * @param array   $input
	 * @param boolean $final
	 * @return string
	 */
	static public function dqlOrder(array $input, $final = true)
	{
		$orderBy = array();
		foreach ($input as $field => $direction)
		{
			$direction = 'DESC' == strtoupper($direction)
				? 'DESC'
				: 'ASC';
			$orderBy[] = "$field $direction";
		}
		return ($final && !empty($orderBy))
			? 'ORDER BY ' . implode(', ', $orderBy)
			: implode(', ', $orderBy);
	}

	/**
	 * Build DQL where statement from array input.
	 * @param array   $input
	 * @param string  $baseTable
	 * @param boolean $final
	 * @param integer $prepend
	 * @param string  $op
	 * @return array
	 */
	static public function dqlFilter(array $input, $baseTable, $final = true, $prepend = 0, $op = ' AND ')
	{
		$prepend++;
		$i      = 0;
		$filter = array();
		$params = array();
		foreach ($input as $field => $value)
		{
			$i++;
			$param = 'p' . $prepend . 'd' . $i;
			!is_array($value)
			&& !strpos($field, '.')
			&& $field = "$baseTable.$field";
			if (is_array($value))
			{
				$subOp     = (' AND ' == $op)
					? ' OR '
					: ' AND ';
				$subFilter = self::dqlFilter($value, $baseTable, false, $prepend, $subOp);
				$filter[]  = '(' . $subFilter['Where'] . ')';
				$params    = array_merge($params, $subFilter['Params']);
			}
			elseif (false !== strpos($value, '%'))
			{
				$filter[]       = "$field LIKE :$param";
				$params[$param] = $value;
			}
			elseif ('BETWEEN' == substr(strtoupper($value), 0, 7))
			{
				$i++;
				$param2 = 'p' . $prepend . 'd' . $i;
				list($x, $y) = explode(',', trim(substr($value, 7, strlen($value) - 2)));
				if ('@' != substr($x, 0, 1) && '@' != substr($y, 0, 1))
				{
					$filter[]        = "$field BETWEEN :$param AND :$param2";
					$params[$param]  = $x;
					$params[$param2] = $y;
				}
				else
				{
					$filter[] = "$field BETWEEN $x AND $y";
				}
			}
			elseif ('NOT IN' == substr(strtoupper($value), 0, 6))
			{
				$val = trim(substr($value, 6, strlen($value) - 6));
				if ('@' != substr($val, 0, 1))
				{
					$filter[]       = "$field NOT IN (:$param)";
					$params[$param] = explode(',', $val);
				}
				else
				{
					$filter[] = "$field NOT IN (" . explode(',', $val) . ")";
				}
			}
			elseif ('=NULL' == strtoupper($value))
			{
				$filter[] = "$field IS NULL";
			}
			elseif ('!NULL' == strtoupper($value))
			{
				$filter[] = "$field IS NOT NULL";
			}
			elseif ('IN ' == substr(strtoupper($value), 0, 3))
			{
				$val = trim(substr($value, 3, strlen($value) - 3));
				if ('@' != substr($val, 0, 1))
				{
					$filter[]       = "$field IN (:$param)";
					$params[$param] = explode(',', $val);
				}
				else
				{
					$filter[] = "$field IN (" . explode(',', $val) . ")";
				}
			}
			elseif ('!=' == substr($value, 0, 2))
			{
				$val = trim(substr($value, 2, strlen($value) - 2));
				if ('@' != substr($val, 0, 1))
				{
					$filter[]       = "$field != :$param";
					$params[$param] = $val;
				}
				else
				{
					$filter[] = "$field != $val";
				}
			}
			elseif ('<>' == substr($value, 0, 2))
			{
				$val = trim(substr($value, 2, strlen($value) - 2));
				if ('@' != substr($val, 0, 1))
				{
					$filter[]       = "$field <> :$param";
					$params[$param] = $val;
				}
				else
				{
					$filter[] = "$field <> $val";
				}
			}
			elseif ('<=' == substr($value, 0, 2))
			{
				$val = trim(substr($value, 2, strlen($value) - 2));
				if ('@' != substr($val, 0, 1))
				{
					$filter[]       = "$field <= :$param";
					$params[$param] = $val;
				}
				else
				{
					$filter[] = "$field <= $val";
				}
			}
			elseif ('>=' == substr($value, 0, 2))
			{
				$val = trim(substr($value, 2, strlen($value) - 2));
				if ('@' != substr($val, 0, 1))
				{
					$filter[]       = "$field >= :$param";
					$params[$param] = $val;
				}
				else
				{
					$filter[] = "$field >= $val";
				}
			}
			elseif ('>' == substr($value, 0, 1))
			{
				$val = trim(substr($value, 1, strlen($value) - 1));
				if ('@' != substr($val, 0, 1))
				{
					$filter[]       = "$field > :$param";
					$params[$param] = $val;
				}
				else
				{
					$filter[] = "$field > $val";
				}
			}
			elseif ('<' == substr($value, 0, 1))
			{
				$val = trim(substr($value, 1, strlen($value) - 1));
				if ('@' != substr($val, 0, 1))
				{
					$filter[]       = "$field < :$param";
					$params[$param] = $val;
				}
				else
				{
					$filter[] = "$field < $val";
				}
			}
			elseif ('=' == substr($value, 0, 1))
			{
				$val = trim(substr($value, 1, strlen($value) - 1));
				if ('@' != substr($val, 0, 1))
				{
					$filter[]       = "$field = :$param";
					$params[$param] = $val;
				}
				else
				{
					$filter[] = "$field = $val";
				}
			}
			elseif ('!' == substr($value, 0, 1))
			{
				$val = trim(substr($value, 1, strlen($value) - 1));
				if ('@' != substr($val, 0, 1))
				{
					$filter[]       = "$field != :$param";
					$params[$param] = $val;
				}
				else
				{
					$filter[] = "$field != $val";
				}
			}
			else
			{
				if ('@' != substr($value, 0, 1))
				{
					$filter[]       = "$field = :$param";
					$params[$param] = $value;
				}
				else
				{
					$value    = substr($value, 1);
					$filter[] = "$field = $value";
				}
			}
		}
		return array(
			'Where'  => ($final && !empty($filter))
				? 'WHERE ' . implode($op, $filter)
				: implode($op, $filter),
			'Params' => $params
		);
	}

}