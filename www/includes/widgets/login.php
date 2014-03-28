<div class="widget">
	<h2>Login</h2>
	<form action="/actions/login.php" method="post">
		<p>Username:</p>
		<input type="text" name="username">
		<p>Password:</p>
		<input type="password" name="password">
		<input type="submit" value="Log In">
	</form>
	<form action="" method="post">
		<input type="hidden" name="widget" value="recover_account">
		<input class="secondary" type="submit" value="Recover Account">
	</form>
	<form action="" method="post">
		<input type="hidden" name="widget" value="register">
		<input class="secondary" type="submit" value="Register">
	</form>
</div>
