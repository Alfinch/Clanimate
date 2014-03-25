<div class="widget">
	<h2>Change Email Address</h2>
	<?php
	if ($_GET['change-email'] === 'success') {
	?>
	<p class="notification">You have successfully changed your email address to <?php echo $user_data['email'] ?>!</p>
	<p><a href="?">Return</a></p>
	<?php
	} else {
		if (!empty($_SESSION["errors"])) {
			output_errors($_SESSION["errors"]);
			unset($_SESSION["errors"]);
		}
	?>
	<form action="/actions/change_email.php" method="post">
		<p>New email address:</p>
		<input type="email" name="email">
		<p>Confirm new email address:</p>
		<input type="email" name="confirm_email">
		<input type="submit" value="Change Email Address">
	</form>
	<p><a href="?">Cancel</a></p>
	<?php } ?>
</div>
