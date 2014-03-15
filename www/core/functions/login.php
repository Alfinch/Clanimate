<?php
include $_SERVER["DOCUMENT_ROOT"] . "/core/init.php";

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
			header("Location: http://" . $_SERVER["SERVER_NAME"] . "/index.php");
			exit();
		}
	}
} else {
	header("Location: http://" . $_SERVER["SERVER_NAME"] . "/index.php");
}
include $_SERVER["DOCUMENT_ROOT"] . "/includes/overall/top.php";
if (isset($errors)) {
	output_errors($errors);
}
include $_SERVER["DOCUMENT_ROOT"] . "/includes/overall/bottom.php" ;
?>