<?php
/**
 * Front controller for default Minify implementation
 *
 * DO NOT EDIT! Configure this utility via config.php and groupsConfig.php
 *
 * @package Minify
 */

define('MINIFY_MIN_DIR', dirname(__FILE__));


#-> Switching configs.
date_default_timezone_set('Africa/Johannesburg');
$isDev   = false;
$isStage = false;
$isLive  = false;
switch (getenv('APPLICATION_ENV'))
{
	case 'development':
		$isDev   = true;
		break;
	case 'staging':
		$isStage = true;
		break;
	default:
		$isLive  = true;
		$uname   = php_uname("n");
		if ('Production.localdomain' == $uname)
		{
			$isStage = true;
		}
		if ('USER-PC' == $uname)
		{
			$isDev = true;
		}
		break;
}
define('IS_DEV_ENV', $isDev);
define('IS_STAGE_ENV', $isStage);
define('IS_LIVE_ENV', $isLive);

// load config
require MINIFY_MIN_DIR . '/config.php';

if (isset($_GET['test'])) {
    include MINIFY_MIN_DIR . '/config-test.php';
}

require "$min_libPath/Minify/Loader.php";
Minify_Loader::register();

Minify::$uploaderHoursBehind = $min_uploaderHoursBehind;
Minify::setCache(
    isset($min_cachePath) ? $min_cachePath : ''
    ,$min_cacheFileLocking
);

if ($min_documentRoot) {
    $_SERVER['DOCUMENT_ROOT'] = $min_documentRoot;
    Minify::$isDocRootSet = true;
}

$min_serveOptions['minifierOptions']['text/css']['symlinks'] = $min_symlinks;
// auto-add targets to allowDirs
foreach ($min_symlinks as $uri => $target) {
    $min_serveOptions['minApp']['allowDirs'][] = $target;
}

if ($min_allowDebugFlag) {
    $min_serveOptions['debug'] = Minify_DebugDetector::shouldDebugRequest($_COOKIE, $_GET, $_SERVER['REQUEST_URI']);
}

if ($min_errorLogger) {
    if (true === $min_errorLogger) {
        $min_errorLogger = FirePHP::getInstance(true);
    }
    Minify_Logger::setLogger($min_errorLogger);
}

// check for URI versioning
if (preg_match('/&\\d/', $_SERVER['QUERY_STRING'])) {
    $min_serveOptions['maxAge'] = 31536000;
}
if (isset($_GET['g'])) {
    // well need groups config
    $min_serveOptions['minApp']['groups'] = (require MINIFY_MIN_DIR . '/groupsConfig.php');
}
if (isset($_GET['f']) || isset($_GET['g'])) {
    // serve!

    if (! isset($min_serveController)) {
        $min_serveController = new Minify_Controller_MinApp();
    }
    Minify::serve($min_serveController, $min_serveOptions);

} elseif ($min_enableBuilder) {
    header('Location: builder/');
    exit();
} else {
    header("Location: /");
    exit();
}