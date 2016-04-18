<?php
namespace Randomizer\Entity;

use Doctrine\ORM\Mapping as ORM;


/**
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks
 * @ORM\Table(name="randomizer_config")
 */
class RandomizerConfig extends \Core\Entity\Base
{

	/**
	 * @ORM\Id
	 * @ORM\Column(type="integer");
	 * @ORM\GeneratedValue(strategy="AUTO")
	 */
	protected $id;

    /**
     * @ORM\Column(name="balls_in_main_set",type="integer", length=50, nullable=false)
     */
    protected $ballsInMainSet;

    /**
     * @ORM\Column(name="balls_in_power_ball_set",type="integer", length=50, nullable=false)
     */
    protected $ballsInPowerBallSet;

    /**
     * @ORM\Column(name="balls_drawn_in_main_set",type="integer", length=50, nullable=false)
     */
    protected $ballsDrawnInMainSet;

    /**
     * @ORM\Column(name="balls_drawn_in_power_ball_set",type="integer", length=50, nullable=false)
     */
    protected $ballsDrawnPowerBallSet;

    /**
     * @ORM\Column(type="datetime");
     */
    protected $created;

    /**
     * @ORM\Column(type="datetime", nullable=true);
     */
    protected $updated;


    //-- Meta data.
    protected $basicFields    = array(
        'id',
        'ballsInMainSet',
        'ballsInPowerBallSet',
        'ballsDrawnInMainSet',
        'ballsDrawnPowerBallSet'
    );
    protected $dateTimeFields = array(
        'created',
        'updated'
    );



    /**
     * @ORM\PrePersist
     */
    public function onPrePersist()
    {
        $this->created  = new \DateTime("now");
    }

    /**
     * @ORM\PreUpdate
     */
    public function setUpdateTime()
    {
        $this->updated = new \DateTime("now");
    }
}