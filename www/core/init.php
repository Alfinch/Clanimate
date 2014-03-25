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

if (isset($_GET['from']) && !empty($_GET['from'])) {
	$to = "?to=" . $_GET['from'];
} else if (isset($page)) {
	if ($page === "deny") $page = "index";
	$to = "?to=" . $page;
} else {
	$to = "";
}
if (isset($page)) {
	$from = "&from=" . $page;
} else {
	$from = "";
}

$errors = array();
?>