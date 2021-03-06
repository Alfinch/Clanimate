<?php
include $_SERVER['DOCUMENT_ROOT'] . "/core/init.php";
logged_in_redirect();

if (!empty($_POST)) {
	foreach ($_POST as $key=>$value) {
		if (empty($value)) {
			$errors[] = "All fields are required.";
			break;
		}
	}
	if (empty($errors)) {
		if (user_exists($_POST['username'])) {
			$errors[] = "The username '" . $_POST['username'] . "' is already in use.";
		}
		if (!ctype_alnum(str_replace(array('_', '-'), '', $_POST['username']))) {
			$errors[] = "Usernames can only contain letters, numbers, underscores and hyphens - no spaces, punctuation or special characters.";
		}
		if (trim($_POST['password']) !== trim($_POST['confirm_password'])) {
			$errors[] = "Your passwords do not match.";
		}
		if (strlen($_POST['password']) < 6) {
			$errors[] = "Your password must be at least 6 characters long.";
		}
		if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
			$errors[] = "A valid email address is required.";
		} else if (email_exists($_POST['email'])) {
			$errors[] = "The email address " . $_POST['email'] . " is already in use.";
		}
	}
	if(empty($errors)) {
		$register_data = array(
			'username'   => $_POST['username'],
			'password'   => $_POST['password'],
			'email'      => $_POST['email'],
		);
		register_user($register_data);
		$alerts[] = "You have successfully registered as " . $_POST['username'] . "!";
		$alerts[] = "You will receive an email shortly allowing you to activate your account.";
		$_SESSION['alerts'] = $alerts;
		go_to_page($_SESSION['page'], $_POST['username']);
		exit();
	} else {
		$_SESSION["errors"] = $errors;
		go_to_page($_SESSION['page'], $_POST['username']);
		exit();
	}
} else {
	go_home();
	exit();
}
?>