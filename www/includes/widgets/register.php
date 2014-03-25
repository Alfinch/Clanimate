<div class="widget">
	<h2>Register</h2>
	<?php
	if ($_GET['register'] === 'success') {
	?>
	<p class="notification">You have been registered successfully! A confirmation email will arrive shortly and allow you to activate your account.</p>
	<p><a href="?">Return</a></p>
	<?php
	} else {
		if (!empty($_SESSION["errors"])) {
			output_errors($_SESSION["errors"]);
			unset($_SESSION["errors"]);
		}
	?>
	<form action="/actions/register.php" method="post">
		<p>Username:</p>
		<input type="text" name="username">
		<p>Password:</p>
		<input type="password" name="password">
		<p>Confirm password:</p>
		<input type="password" name="confirm_password">
		<p>Email:</p>
		<input type="email" name="email">
		<input type="submit" value="Register">
	</form>
	<p><a href="?">Cancel</a></p>
	<?php } ?>
</div>
