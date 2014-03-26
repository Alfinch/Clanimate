<?php
include $_SERVER['DOCUMENT_ROOT'] . "/core/init.php";
protect_page($page);
$_SESSION['page'] = "profile";
include$_SERVER['DOCUMENT_ROOT'] . "/includes/overall/top.php";
?>
<div id="middleSection" class="page">
	<div>
		<h1>Profile</h1>
	</div>
</div>
</div>
<?php include $_SERVER['DOCUMENT_ROOT'] . "/includes/layout/sidecolumn.php" ?>
</body>
</html>
