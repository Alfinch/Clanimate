<div class="widget">
	<h2>Change Password</h2>
	<form action="/actions/change_password.php" method="post">
		<p>Current password:</p>
		<input type="password" name="current_password">
		<p>New password:</p>
		<input type="password" name="password">
		<p>Confirm new password:</p>
		<input type="password" name="confirm_password">
		<input type="submit" value="Change Password">
	</form>
	<form action="" method="post">
		<input class="secondary" type="submit" value="Cancel">
	</form>
</div>
