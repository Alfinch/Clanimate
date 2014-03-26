<div class="widget">
	<h2>Hello, <?php echo $user_data["username"] ?>!</h2>
	<form action="/actions/logout.php" method="post">
		<input type="submit" value="Log Out">
	</form>
	<form action="" method="post">
		<input type="hidden" name="widget" value="change_password">
		<input class="secondary" type="submit" value="Change Password">
	</form>
	<form action="" method="post">
		<input type="hidden" name="widget" value="change_email">
		<input class="secondary" type="submit" value="Change Email">
	</form>
</div>
