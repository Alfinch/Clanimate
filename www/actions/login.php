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
		if (!$login) {
			$errors[] = "Incorrect username or password.";
		} else {
			$_SESSION['id'] = $login;
			$to = (isset($_GET['to']) && !empty($_GET['to'])) ? "/" . $_GET['to'] . ".php" : "";
			header("Location: http://" . $_SERVER["SERVER_NAME"] . $to);
			exit();
		}
	}
	
	$_SESSION["errors"] = $errors;
	if (isset($_GET['from']) && !empty($_GET['from'])) {
		header("Location: http://" . $_SERVER["SERVER_NAME"] . "/" . $_GET['from'] . ".php?from=" . $_GET['to']);
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