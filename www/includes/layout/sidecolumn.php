<div id="sideColumn">
	<?php
		if (logged_in()) {
			include $_SERVER['DOCUMENT_ROOT'] . "/includes/widgets/userinfo.php";
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
