<div class="widget">
	<h2>Change Password</h2>
	<?php
	if ($_GET['change-password'] === 'success') {
	?>
	<p class="notification">You have successfully changed your password!</p>
	<p><a href="?">Return</a></p>
	<?php
	} else {
		if (!empty($_SESSION["errors"])) {
			output_errors($_SESSION["errors"]);
			unset($_SESSION["errors"]);
		}
	?>
	<form action="/actions/change_password.php" method="post">
		<p>Current password:</p>
		<input type="password" name="current_password">
		<p>New password:</p>
		<input type="password" name="password">
		<p>Confirm new password:</p>
		<input type="password" name="confirm_password">
		<input type="submit" value="Change Password">
	</form>
	<p><a href="?">Cancel</a></p>
	<?php } ?>
</div>
