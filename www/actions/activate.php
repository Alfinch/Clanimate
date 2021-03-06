<?php
include $_SERVER['DOCUMENT_ROOT'] . "/core/init.php";
logged_in_redirect();

if (isset($_GET["email"], $_GET["email_code"])) {
	$email      = trim($_GET["email"]);
	$email_code = trim($_GET["email_code"]);
	
	if (!email_exists($email)) {
		$errors[] = "Invalid email address";
	} else if (!activate($email, $email_code)) {
		$errors[] = "There was a problem activating your account, please contact us for help";
	} else {
		$alerts[] = "You have successfully activated your account, and may now log in.";
		$_SESSION['alerts'] = $alerts;
		go_to_page($_SESSION['page']);
		exit();
	}
	
	$_SESSION["errors"] = $errors;
	go_to_page($_SESSION['page']);
	exit();
	
} else {
	header("Location: http://" . $_SERVER["SERVER_NAME"]);
	exit();
}
?>