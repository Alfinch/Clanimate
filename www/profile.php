<?php
include $_SERVER['DOCUMENT_ROOT'] . "/core/init.php";
$_SESSION['page'] = "profile";
protect_page($page);
if (isset($_GET['username']) && !empty($_GET['username'])) {
	$username = $_GET['username'];
	if (user_exists($username)) {
		$id           = id_from_username($username);
		$profile_data = user_data($id);
	} else {
		header("Location: http://" . $_SERVER["SERVER_NAME"]);
	}
} else {
	header("Location: http://" . $_SERVER["SERVER_NAME"]);
}

include$_SERVER['DOCUMENT_ROOT'] . "/includes/overall/top.php";
?>
<div id="middleSection" class="page">
	<div>
		<h1><?php echo $username ?></h1>
	</div>
</div>
</div>
<?php include $_SERVER['DOCUMENT_ROOT'] . "/includes/layout/sidecolumn.php" ?>
</body>
</html>
