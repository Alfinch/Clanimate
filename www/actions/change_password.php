<?php
include $_SERVER['DOCUMENT_ROOT'] . "/core/init.php";

if (!empty($_POST)) {
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
		header("Location: http://" . $_SERVER["SERVER_NAME"] . "?change-password=success");
		exit();
	} else {
		$_SESSION["errors"] = $errors;
		header("Location: http://" . $_SERVER["SERVER_NAME"] . "?change-password");
		exit();
	}
} else {
	header("Location: http://" . $_SERVER["SERVER_NAME"]);
	exit();
}
?>