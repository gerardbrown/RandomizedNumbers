<?php
namespace Core\Comms;


/**
 * Zend email wrapper class.
 */
class Email
{

	/**
	 * Zend Mail object
	 * @var Zend_Mail
	 */
	protected $_service;

	/**
	 * Body tag to be compatible with ZF2 mail message
	 * @var array
	 */
	protected $_body = array();


	/**
	 * Summoning.
	 */
	public function __construct()
	{
		$this->_service = new \Zend\Mail\Message();
	}

	/**
	 * Set message context.
	 * @param array $aContext
	 * @return \Core\Comms\Email
	 */
	public function setContext(array $aContext = array())
	{
		foreach ($aContext as $sParam => $mValue)
		{
			switch ($sParam)
			{
				case 'From':
					$this->_service->setFrom($mValue);
					break;
				case 'To':
					if (IS_DEV_ENV)
					{
						#-> Environmental override.
						\Debug::log(
							'Email.send Override: ' . $mValue,
							isset($aContext['Subject'])
								? $aContext['Subject']
								: 'No subject'
						);
						$this->_service->addTo('quantumweaver@gmail.com');
					}
					else
					{
						$this->_service->addTo($mValue);
					}
					break;
				case 'Cc':
					if (!IS_DEV_ENV && !IS_STAGE_ENV)
					{
						$this->_service->addCc($mValue);
					}
					break;
				case 'Bcc':
					if (!IS_DEV_ENV && !IS_STAGE_ENV)
					{
						$this->_service->addBcc($mValue);
					}
					break;
				case 'Subject':
					$this->_service->setSubject($mValue);
					break;
				case 'Body':
					$tmpBody       = new \Zend\Mime\Part($mValue);
					$tmpBody->type = 'text/plain';
					$this->_body[] = $tmpBody;
					//$this->_service->setBodyText($mValue);
					break;
				case 'Html':
					$tmpBody       = new \Zend\Mime\Part($mValue);
					$tmpBody->type = 'text/html';
					$this->_body[] = $tmpBody;
					//$this->_service->setBodyHtml($mValue);
					break;
				case 'ComplexAttachment':
					foreach ($mValue as $cid => $meta)
					{
						if (isset($meta['data']) && !empty($meta['data']))
						{
							$file              = new \Zend\Mime\Part($meta['data']);
							$file->disposition = \Zend\Mime\Mime::DISPOSITION_INLINE;
							$file->encoding    = \Zend\Mime\Mime::ENCODING_BASE64;
							$file->description = 'Attached file';
							isset($meta['type'])
							&& $file->type = $meta['type'];
							isset($meta['filename'])
							&& $file->filename = $meta['filename'];
							$file->id      = $cid;
							$this->_body[] = $file;
							//$this->_service->addAttachment($file);
						}
					}
					break;
				case 'Attachment':
					foreach ($mValue as $fileName => $fileData)
					{
						if (!empty($fileData))
						{
							$file              = new \Zend\Mime\Part($fileData);
							$file->disposition = \Zend\Mime\Mime::DISPOSITION_INLINE;
							$file->encoding    = \Zend\Mime\Mime::ENCODING_BASE64;
							$file->description = 'Attached file';
							$file->filename    = $fileName;

							$this->_body[] = $file;
						}
					}
					break;
			}
		}
		return $this;
	}

	/**
	 * Send message.
	 * @param array $aContext
	 * @return \Core\Comms\Email
	 */
	public function send(array $aContext = array())
	{
		empty($aContext)
		|| $this->setContext($aContext);
		$transport = new \Zend\Mail\Transport\Sendmail();

		/*
		 * Alteration to include message body as a \Zend\Mime\Message() as per ZF2 specification
		 */
		$body = new \Zend\Mime\Message();
		$body->setParts($this->_body);
		$this->_service->setBody($body);

		$transport->send($this->_service);
		return $this;
	}

}

