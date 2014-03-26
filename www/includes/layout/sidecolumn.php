<div id="sideColumn">
	<?php
	if (!empty($_SESSION["alerts"])) {
		output_alerts($_SESSION["alerts"]);
		unset($_SESSION["alerts"]);
	}
	if (!empty($_SESSION["errors"])) {
		output_errors($_SESSION["errors"]);
		unset($_SESSION["errors"]);
	}
	if (logged_in()) {
		if (isset($_POST['widget']) && $_POST['widget'] === "change_password") {
			include $_SERVER['DOCUMENT_ROOT'] . "/includes/widgets/change_password.php";
		} else if (isset($_POST['widget']) && $_POST['widget'] === "change_email") {
			include $_SERVER['DOCUMENT_ROOT'] . "/includes/widgets/change_email.php";
		} else {
			include $_SERVER['DOCUMENT_ROOT'] . "/includes/widgets/userinfo.php";
		}
	} else {
		if (isset($_POST['widget']) && $_POST['widget'] === "register") {
			include $_SERVER['DOCUMENT_ROOT'] . "/includes/widgets/register.php";
		} else {
			include $_SERVER['DOCUMENT_ROOT'] . "/includes/widgets/login.php";
		}
	}
	?>
</div>
