<?php
if (isset($_GET['from']) && !empty($_GET['from'])) {
	$to = "?to=" . $_GET['from'];
} else if (isset($page)) {
	if ($page === "deny") $page = "index";
	$to = "?to=" . $page;
} else {
	$to = "";
}
?>
<div class="widget">
	<h2>Login</h2>
	<form action="/core/functions/login.php<?php echo $to ?>" method="post">
		<p>Username:</p>
		<input type="text" name="username">
		<p>Password:</p>
		<input type="password" name="password">
		<input type="submit" value="Log in">
	</form>
	<a href="?register">Register</a>
</div>
