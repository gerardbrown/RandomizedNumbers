<?php
namespace WinningNumbers\Service;


class WinningNumbers extends \Core\Service\Base implements \Core\Service\ServiceInterface
{
    // ----------------------- SERVICE DEFINITION
    /**
     * @var array
     */
    protected $meta = array(
        'Entity'  => 'WinningNumbers\\Entity\\WinningNumbers',
        'Actions' => array(
            'GetWinningResults'  => array(
                'Authentication'     => array(),
                'Description'        => 'Retrieve winning results.',
                'RequiredParameters' => array(),
                'OptionalParameters' => array()
            ),
            'Play'  => array(
                'Authentication'     => array(),
                'Description'        => 'Play randomizer.',
                'RequiredParameters' => array(),
                'OptionalParameters' => array()
            ),
            'ExportResult'  => array(
                'Authentication'     => array(),
                'Description'        => 'Export results to CSV file.',
                'RequiredParameters' => array(),
                'OptionalParameters' => array()
            )
        )
    );


    /**
     * Export winning results to CSV.
     * @return \Core\Service\Response
     */
    protected function actionExportResult()
    {
        date_default_timezone_set('Africa/Johannesburg');

        $exportFileName = 'winning_result_' . date('mdYhis') . '.csv';
        $fileName = './public/csvExport/' . $exportFileName;

        $method = (file_exists($fileName)) ? 'a' : 'w';

        $fp = fopen($fileName, $method) or $this->response->error(array('Could not open file'));

        //-- Collect data.
        $queryResults     = $this->em->createQuery(
            'SELECT winningNumbers '
            . 'FROM WinningNumbers\\Entity\\WinningNumbers winningNumbers '
            . 'ORDER BY winningNumbers.created DESC'
        )
            ->getArrayResult();

        fputcsv($fp, array(
            'winningNumbers' => 'WINNING NUMBERS',
            'powerBallNumber' => 'POWER BALL NUMBERS',
            'created' => 'CREATED DATE',
        ), ',');

        //-- Pack data.
        foreach ($queryResults as $queryResult)
        {
            \Debug::log('$queryResult',$queryResult);

            $createdDate = str_replace('.000000','',$queryResult['created']->date);

            fputcsv($fp, array(
                'winningNumbers'              => $queryResult['winningNumbers'],
                'powerBallNumber'             => $queryResult['powerBallNumber'],
                'created'                     => $createdDate
            ), ',');
        }


        fclose($fp);

        return $this->response->success(array('fileName' => $exportFileName));
    }


    /**
     * Create winning results.
     * @return \Core\Service\Response
     */
    protected function actionPlay()
    {
        //-- Collect data.
        $queryResults     = $this->em->createQuery(
            'SELECT randomizerConfig '
            . 'FROM Randomizer\\Entity\\RandomizerConfig randomizerConfig '
        )
        ->getArrayResult();

        $winningNumbers = '';
        $powerBallNumbers = '';

        foreach ($queryResults as $queryResult)
        {
            $winningNumbersArray = $this->generateRandomUniqueNumbersArray(1,$queryResult['ballsInMainSet'],$queryResult['ballsDrawnInMainSet']);
            $winningNumbers = implode(" ",$winningNumbersArray);

            $powerBallNumberArray = $this->generateRandomUniqueNumbersArray(1,$queryResult['ballsInPowerBallSet'],$queryResult['ballsDrawnPowerBallSet']);
            $powerBallNumbers = implode(" ",$powerBallNumberArray);
        }

        \Debug::log('$winningNumbers',$winningNumbers);
        \Debug::log('$powerBallNumbers',$powerBallNumbers);

        //-- Create winning number item entries.
        $createEntry                     = new \WinningNumbers\Entity\WinningNumbers();
        $createEntry->fromArray(
            array(
                'winningNumbers'    => $winningNumbers,
                'powerBallNumber'   => $powerBallNumbers
            )
        );
        $this->em->persist($createEntry);
        $this->em->flush();

        //-- Respond.
        return $this->response->success(array('winningNumbers' => $winningNumbers, 'powerBallNumber' => $powerBallNumbers));
    }

    /**
     * Generate unique random numbers and add it to an array
     * @param $nri
     * @param $min
     * @param $max
     * @param array $arr
     * @return array
     */
    protected function generateRandomUniqueNumbersArray($min, $max, $nri, $arr=array())
    {
        $nr = mt_rand($min, $max); // gets a random number
        // if the number already exists in $arr, autocalls this function
        // else, adds the number in $arr
        // if the number of items in $arr is lower then $nri, autocalls the function (till gets $nri elements in $arr)
        // returns the array
        if(in_array($nr, $arr))
        {
            $arr = $this->generateRandomUniqueNumbersArray($min, $max, $nri, $arr);
        }
        else
        {
            $arr[] = $nr;
            if(count($arr) < $nri)
            {
                $arr = $this->generateRandomUniqueNumbersArray($min, $max, $nri, $arr);
            }
        }
        return $arr;
    }

    /**
     * Retrieve winning results.
     * @return \Core\Service\Response
     */
    protected function actionGetWinningResults()
    {
        //-- Collect data.
        $queryResults     = $this->em->createQuery(
            'SELECT winningNumbers '
            . 'FROM WinningNumbers\\Entity\\WinningNumbers winningNumbers '
            . 'ORDER BY winningNumbers.created DESC'
        )
        ->setMaxResults(10)
        ->getArrayResult();

        //-- Pack data.
        $winningResults = array();
        foreach ($queryResults as $queryResult)
        {
            \Debug::log('$queryResult',$queryResult);

            $createdDate = '';

            if(!empty($queryResult['created']))
            {
                $createdDate = str_replace('.000000','',$queryResult['created']->date);
            }
            $winningResults[] = array(
                'id'        => $queryResult['id'],
                'winningNumbers'        => $queryResult['winningNumbers'],
                'powerBallNumber'        => $queryResult['powerBallNumber'],
                'created'        => $createdDate
            );
        }

        //-- Respond.
        return $this->response->success($winningResults);
    }
}