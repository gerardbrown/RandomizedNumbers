<?php


/**
 * Some useful debugging functionality.
 * @author gerard.brown
 *
 */
class Debug
{

	/**
	 * Log to php error log.
	 * @param string       $label
	 * @param array|string $output
	 */
	static public function log($label, $output)
	{
		error_log("$label: " . print_r($output, true));
	}

	/**
	 * Log a debug backtrace to php error log.
	 */
	static public function logBacktrace()
	{
		error_log(print_r(debug_backtrace(), true));
	}

}