<?php
if (isset($_GET['from']) && !empty($_GET['from'])) {
	$to = "?to=" . $_GET['from'];
} else if (isset($page)) {
	if ($page === "deny") $page = "index";
	$to = "?to=" . $page;
} else {
	$to = "";
}
if (isset($page)) {
	$from = "&from=" . $page;
} else {
	$from = "";
}
?>
<div class="widget">
	<h2>Login</h2>
	<?php
	if (!empty($_SESSION["errors"])) {
		output_errors($_SESSION["errors"]);
		unset($_SESSION["errors"]);
	}
	?>
	<form action="/actions/login.php<?php echo $to . $from ?>" method="post">
		<p>Username:</p>
		<input type="text" name="username">
		<p>Password:</p>
		<input type="password" name="password">
		<input type="submit" value="Log In">
	</form>
	<a href="?register">Register</a>
</div>
