<?php
namespace Randomizer\Fixture;

class RandomizerConfig extends \Fixture\Service\Fixture
{

    /**
     * Build number of main balls to be drawn.
     */
    static public function build()
    {
        parent::addStack(
            '\Randomizer\Entity\RandomizerConfig',
            array(
                'RandomizerConfig' => array(
                    'ballsInMainSet'            => '40',
                    'ballsInPowerBallSet'       => '10',
                    'ballsDrawnInMainSet'       => '6',
                    'ballsDrawnPowerBallSet'    => '1',
                )
            )
        );

    }

}