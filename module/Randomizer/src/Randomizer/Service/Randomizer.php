<?php
namespace Randomizer\Service;

class Randomizer extends \Core\Service\Base implements \Core\Service\ServiceInterface
{
// ----------------------- SERVICE DEFINITION
    /**
     * @var array
     */
    protected $meta = array(
        'Entity'  => 'Randomizer\\Entity\\RandomizerConfig',
        'Actions' => array(
            'ListConfig' => array(
                'Authentication'     => array('Administrator'),
                'Description'        => 'List config.',
                'RequiredParameters' => array(),
                'OptionalParameters' => array()
            ),
            'ViewConfig' => array(
                'Authentication'     => array('Administrator'),
                'Description'        => 'View config.',
                'RequiredParameters' => array(
                    'id' => 'Id'
                ),
                'OptionalParameters' => array()
            ),
            'Cancel' => array(
                'Authentication'     => array('Administrator'),
                'Description'        => 'Cancel Edit.',
                'RequiredParameters' => array(),
                'OptionalParameters' => array()
            ),
            'Update' => array(
                'Authentication'     => array('Administrator'),
                'Description'        => 'Update configs.',
                'RequiredParameters' => array(
                    'id' => 'Id',
                    'ballsInMainSet' => 'Integer',
                    'ballsDrawnInMainSet' => 'Integer',
                    'ballsInPowerBallSet' => 'Integer',
                    'ballsDrawnPowerBallSet' => 'Integer'
                ),
                'OptionalParameters' => array()
            ),
        )
    );


    /**
     * @param array $data
     * @return \Core\Service\Response
     * @throws \Exception
     */
    protected function actionUpdate(array $data)
    {
        \Debug::log('$data',$data);

        $config = $this->dataFind(
            array('id' => $data['id']),
            array(

            )
        );

        \Debug::log('$config->id',$config->id);

        //-- Create winning number item entries.
        $config->fromArray(
            array(
                'ballsInMainSet'            => $data['ballsInMainSet'],
                'ballsDrawnInMainSet'       => $data['ballsDrawnInMainSet'],
                'ballsInPowerBallSet'       => $data['ballsInPowerBallSet'],
                'ballsDrawnPowerBallSet'    => $data['ballsDrawnPowerBallSet']
            )
        );
        $this->em->persist($config);
        $this->em->flush();


        //-- Respond.
        return $this->response->success($data);
    }

    /**
     * @param array $data
     * @return \Core\Service\Response
     * @throws \Exception
     */
    protected function actionCancel(array $data)
    {
        //-- Respond.
        return $this->response->success($data);
    }

    /**
     * View an configs.
     * @param array $data
     * @return \Core\Service\Response
     * @throws \Exception
     */
    protected function actionViewConfig(array $data)
    {
        //-- Collect data.
        $config = $this->dataCollect($data['id']);

        //-- Respond.
        return $this->response->success($config);
    }

    /**
     * List system configs.
     * @param array $data
     * @return \Core\Service\Response
     */
    protected function actionListConfig(array $data)
    {
        //-- Collect data.
        $dqlQuery        = 'SELECT [SELECTION] '
            . 'FROM \\Randomizer\\Entity\\RandomizerConfig randomizerConfig '
            . '[WHERE] [ORDER]';
        $selection       = 'randomizerConfig';
        $numberOfRecords = 100;
        $page            = 1;
        $filter          = array();
        $order           = array(
            'randomizerConfig.created' => 'DESC'
        );
        $group           = '';
        $fields          = array(
            'id',
            'ballsInMainSet',
            'ballsInPowerBallSet',
            'ballsDrawnInMainSet',
            'ballsDrawnPowerBallSet',
            'updated'
        );
        $baseTable       = 'randomizerConfig';
        $orders          = $this->dataGrid(
            $dqlQuery,
            $selection,
            $numberOfRecords,
            $page,
            $filter,
            $order,
            $group,
            $fields,
            $baseTable
        );

        //-- Respond.
        return $this->response->success($orders);
    }
}