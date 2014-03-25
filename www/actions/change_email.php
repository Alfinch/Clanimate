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
		if (trim($_POST['email']) !== trim($_POST['confirm_email'])) {
			$errors[] = "Your new email addresses do not match.";
		} else if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
			$errors[] = "A valid email address is required.";
		}
	}
	if (empty($errors)) {
		change_email($_SESSION["id"], trim($_POST['email']));
		header("Location: http://" . $_SERVER["SERVER_NAME"] . "?change-email=success");
		exit();
	} else {
		$_SESSION["errors"] = $errors;
		header("Location: http://" . $_SERVER["SERVER_NAME"] . "?change-email");
		exit();
	}
} else {
	header("Location: http://" . $_SERVER["SERVER_NAME"]);
	exit();
}
?>