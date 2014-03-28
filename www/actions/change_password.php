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
		if (validate_password(trim($_POST['current_password']), $user_data['hash']) === false) {
			$errors[] = "The password you entered was incorrect.";
		}
		if (trim($_POST['password']) !== trim($_POST['confirm_password'])) {
			$errors[] = "Your new passwords do not match.";
		}
		if (strlen(trim($_POST['password'])) < 6) {
			$errors[] = "Your new password must be at least 6 characters long.";
		}
	}
	if (empty($errors)) {
		change_password($_SESSION["id"], trim($_POST['password']));
		$alerts[] = "You have successfully changed your password.";
		$_SESSION['alerts'] = $alerts;
		go_to_page($_SESSION['page'], $user_data['username']);
		exit();
	} else {
		$_SESSION["errors"] = $errors;
		go_to_page($_SESSION['page'], $user_data['username']);
		exit();
	}
} else {
	go_home();
	exit();
}
?>