<?php
namespace Profile\Entity;

use Doctrine\ORM\Mapping as ORM;


/**
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks
 * @ORM\Table(name="profile", uniqueConstraints={@ORM\UniqueConstraint(name="unique_username", columns={"username"})})
 */
class Profile extends \Core\Entity\Base
{

	/**
	 * @ORM\Id
	 * @ORM\Column(type="integer");
	 * @ORM\GeneratedValue(strategy="AUTO")
	 */
	protected $id;

	/**
	 * @ORM\Column(type="string", length=25, name="username", unique=true)
	 */
	protected $username;

	/**
	 * @ORM\Column(type="string", length=42)
	 */
	protected $password;

	/**
	 * @ORM\Column(type="string", length=42, name="password_salt")
	 */
	protected $salt;

	/**
	 * @ORM\Column(type="string", length=100, name="first_name")
	 */
	protected $firstName;

	/**
	 * @ORM\Column(type="string", length=100, name="family_name")
	 */
	protected $familyName;

	/**
	 * @ORM\Column(type="string", length=201, name="full_name")
	 */
	protected $fullName;

	/**
	 * @ORM\Column(type="string", length=255, unique=true)
	 */
	protected $email;

	/**
	 * @ORM\Column(type="string", length=20)
	 */
	protected $mobile;

	/**
	 * @ORM\Column(type="string", length=25, name="user_type")
	 **/
	protected $userType = 'User';

	/**
	 * @ORM\Column(type="datetime");
	 */
	protected $created;


	//-- Meta data.
	protected $basicFields    = array(
		'id',
		'username',
		'firstName',
		'familyName',
		'fullName',
		'email',
		'mobile',
		'userType'
	);
	protected $dateTimeFields = array(
		'created'
	);


	/**
	 * Magic setter to save protected properties.
	 * @param string $property
	 * @param mixed  $value
	 */
	public function __set($property, $value)
	{
		if ('password' == $property)
		{
			$this->salt                = sha1(mt_rand(1000000000, 9999999999));
			$this->password            = sha1(sha1($value) . 'Salt' . $this->salt);
			$this->forcePasswordChange = true;
			$this->datePasswordChanged = new \DateTime("now");
			return;
		}
		$this->$property = $value;
	}

	/**
	 * @ORM\PrePersist
	 */
	public function onPrePersist()
	{
		$this->created  = new \DateTime("now");
		$this->fullName = $this->firstName . ' ' . $this->familyName;
	}

	/**
	 * @ORM\PreUpdate
	 */
	public function onPreUpdate()
	{
		$this->fullName = $this->firstName . ' ' . $this->familyName;
	}

	/**
	 * Check if provided password is valid.
	 * @param string $password
	 * @return boolean
	 */
	public function passwordValid($password)
	{
		return sha1(sha1($password) . 'Salt' . $this->salt) == $this->password;
	}

	/**
	 * Populate from an array.
	 * @param array   $data
	 * @param boolean $rebuild
	 */
	public function fromArray($data = array(), $rebuild = false)
	{
		parent::fromArray($data, $rebuild);
		if (isset($data['password']))
		{
			$this->salt     = sha1(mt_rand(1000000000, 9999999999));
			$this->password = sha1(sha1($data['password']) . 'Salt' . $this->salt);
		}
	}
}