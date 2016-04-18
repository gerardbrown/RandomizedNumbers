<?php
namespace Core\Service;


/**
 * Class Response for standardized service responses.
 * @package Core\Service
 * @author  gerard.brown
 */
class Response
{

	/**
	 * @var string
	 */
	protected $status;
	/**
	 * @var string
	 */
	protected $message;
	/**
	 * @var array
	 */
	protected $data = array();


	/**
	 * @param array $data
	 */
	public function __construct(array $data = array())
	{
		$this->data = $data;
	}

	/**
	 * Set success response.
	 * @param array $data
	 * @return $this
	 */
	public function success(array $data = array())
	{
		$this->status = 'Success';
		$this->data   = $data;
		return $this;
	}

	/**
	 * Set error response.
	 * @param       $message
	 * @param array $data
	 * @return $this
	 */
	public function error($message, array $data = array())
	{
		$this->status  = 'Error';
		$this->message = $message;
		$this->data    = $data;
		return $this;
	}

	/**
	 * Check if execution was successful.
	 * @return boolean
	 */
	public function ok()
	{
		return 'Success' == $this->status;
	}

	/**
	 * Retrieve error message.
	 * @return string
	 */
	public function getMessage()
	{
		return $this->message;
	}

	/**
	 * Retrieve response data.
	 * @return string
	 */
	public function getData()
	{
		return $this->data;
	}

	/**
	 * Pack into array.
	 * @return array
	 */
	public function toArray()
	{
		return array(
			'Status'  => $this->status,
			'Message' => $this->message,
			'Data'    => $this->data
		);
	}

}