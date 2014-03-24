<div id="sideColumn">
	<?php
		if (logged_in()) {
			if (isset($_GET['change-password'])) {
				include $_SERVER['DOCUMENT_ROOT'] . "/includes/widgets/change_password.php";
			} else if (isset($_GET['change-email'])) {
				include $_SERVER['DOCUMENT_ROOT'] . "/includes/widgets/change_email.php";
			} else {
				include $_SERVER['DOCUMENT_ROOT'] . "/includes/widgets/userinfo.php";
			}
		} else {
			if (isset($_GET['register'])) {
				include $_SERVER['DOCUMENT_ROOT'] . "/includes/widgets/register.php";
			} else {
				include $_SERVER['DOCUMENT_ROOT'] . "/includes/widgets/login.php";
			}
		}
		include $_SERVER['DOCUMENT_ROOT'] . "/includes/widgets/usercount.php";
	?>
</div>
