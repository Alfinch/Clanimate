<?php
session_start();
//error_reporting(false);

require_once("database/connect.php");
require_once("functions/general.php");
require_once("functions/users.php");

if (logged_in()) {
	$user_data = user_data($_SESSION["id"]);
	if (user_active($user_data["username"]) === false) {
		session_destroy();
		header("Location: http://" . $_SERVER["SERVER_NAME"] . "/index.php");
		exit();
	}
}

$errors = array();
$alerts = array();
?>