<?php
namespace WinningNumbers\Entity;

use Doctrine\ORM\Mapping as ORM;


/**
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks
 * @ORM\Table(name="winning_numbers")
 */
class WinningNumbers extends \Core\Entity\Base
{

	/**
	 * @ORM\Id
	 * @ORM\Column(type="integer");
	 * @ORM\GeneratedValue(strategy="AUTO")
	 */
	protected $id;

	/**
	 * @ORM\Column(name="winning_numbers",type="string", length=50)
	 */
	protected $winningNumbers;

	/**
	 * @ORM\Column(name="winning_power_ball_number",type="string", length=50)
	 */
	protected $powerBallNumber;

	/**
	 * @ORM\Column(type="datetime");
	 */
	protected $created;


	//-- Meta data.
	protected $basicFields    = array(
		'id',
		'winningNumbers',
		'powerBallNumber'
	);
	protected $dateTimeFields = array(
		'created'
	);



	/**
	 * @ORM\PrePersist
	 */
	public function onPrePersist()
	{
		$this->created  = new \DateTime("now");
	}
}