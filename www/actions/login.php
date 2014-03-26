<?php
include $_SERVER['DOCUMENT_ROOT'] . "/core/init.php";

if (empty($_POST) === false) {
	$username = $_POST["username"];
	$password = $_POST["password"];
	
	if (empty($username) || empty($password)) {
		$errors[] = "You need to enter both a username and password.";
	} else if (user_exists($username) === false) {
		$errors[] = "Incorrect username or password.";
	} else if (user_active($username) === false) {
		$errors[] = "The user " . $username . " has not been activated.";
	} else {
		if (strlen($username) > 32) {
			$errors[] = "The username " . $username . " exceeds the maximum length of 32 characters.";
		}
	
		$login = login($username, $password);
		if ($login) {
			$alerts[] = "You have successfully logged in as " . $username . "!";
			
			$_SESSION['id'] = $login;
			$_SESSION['alerts'] = $alerts;
			header("Location: http://" . $_SERVER["SERVER_NAME"] . "/" . $_SESSION["page"] . ".php");
			exit();
		} else {
			$errors[] = "Incorrect username or password.";
		}
	}
	
	$_SESSION["errors"] = $errors;
	if (isset($_GET['from']) && !empty($_GET['from'])) {
		header("Location: http://" . $_SERVER["SERVER_NAME"] . "/" . $_SESSION["page"] . ".php");
		exit();
	} else {
		header("Location: http://" . $_SERVER["SERVER_NAME"]);
		exit();
	}
} else {
	header("Location: http://" . $_SERVER["SERVER_NAME"]);
	exit();
}
?>