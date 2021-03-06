<?php
include $_SERVER['DOCUMENT_ROOT'] . "/core/init.php";

if (!empty($_POST) && logged_in()) {
	foreach ($_POST as $key=>$value) {
		if (empty($value)) {
			$errors[] = "All fields are required.";
			break;
		}
	}
	if (empty($errors)) {
		if (trim($_POST['email']) !== trim($_POST['confirm_email'])) {
			$errors[] = "Your new email addresses do not match.";
		} else if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
			$errors[] = "A valid email address is required.";
		} else if (email_exists(trim($_POST['email']))) {
			$errors[] = "The email address " . $_POST['email'] . " is already in use.";
		}
	}
	if (empty($errors)) {
		confirm_email($_SESSION["id"], trim($_POST['email']));
		$alerts[] = "You have requested your email be changed to " . trim($_POST['email']) . ".";
		$alerts[] = "You will receive an email shortly allowing you to confirm this.";
		$_SESSION['alerts'] = $alerts;
		go_to_page($_SESSION['page'], $user_data['username']);
		exit();
	} else {
		$_SESSION["errors"] = $errors;
		go_to_page($_SESSION['page'], $user_data['username']);
		exit();
	}
} else if (isset($_GET['username'], $_GET['email_code'])) {
	$username   = trim($_GET["username"]);
	$email_code = trim($_GET["email_code"]);
	
	if (!change_email($username, $email_code)) {
		$errors[] = "There was a problem changing your email address, please contact us for help.";
	} else {
		$alerts[] = "You have successfully changed your email address.";
		$_SESSION['alerts'] = $alerts;
		go_home();
		exit();
	}
	
	$_SESSION["errors"] = $errors;
	go_home();
	exit();
} else {
	go_home();
	exit();
}
?>