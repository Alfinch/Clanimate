<?php
include $_SERVER['DOCUMENT_ROOT'] . "/core/init.php";

if (!empty($_POST) && !logged_in()) {
	if (isset($_POST['email']) && !empty($_POST['email'])) {
		if (email_exists($_POST['email'])) {
			recover_account($_POST['email']);
			$alerts[] = "An email has been sent to " . $_POST['email'] . " containing your login details.";
			$_SESSION['alerts'] = $alerts;
		} else {
			$errors[] = "The email address " . $_POST['email'] . " is not currently registered with us.";
			$_SESSION['errors'] = $errors;
		}
		go_home();
	} else {
		go_home();
		exit();
	}
} else {
	go_home();
	exit();
}
?>