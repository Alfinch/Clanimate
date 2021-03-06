<?php
include $_SERVER['DOCUMENT_ROOT'] . "/core/init.php";
if (isset($_GET['username']) && !empty($_GET['username'])) {
	$username = $_GET['username'];
	if (user_exists($username)) {
		$id           = id_from_username($username);
		$profile_data = user_data($id);
		$_SESSION['page'] = "user/" . $username;
	} else {
		go_home();
	}
} else {
	go_home();
}

include$_SERVER['DOCUMENT_ROOT'] . "/includes/overall/top.php";
?>
<div id="middleSection" class="page">
	<div>
		<h1><?php echo $username ?></h1>
		<?php 
			$private = (isset($_SESSION['id']) && $id === $_SESSION['id']);
			$animationList = list_user_animations($id, $private, 0);
			if ($animationList) {
				echo "<ul class=\"animationList\">";
				foreach($animationList as $animation) {
					$editLink = $private ? "<a class=\"buttonLink\" href=\"http://" . $_SERVER["SERVER_NAME"] . "/editor/" . $animation["id"] . "/\">Edit</a>" : "";
					$published = ($private && $animation["published"] === "1") ? "<img src=\"http://" . $_SERVER["SERVER_NAME"] . "/img/svg/published_icon.svg\"/>" : "";
					echo "<li><a class=\"buttonLink\" href=\"http://" . $_SERVER["SERVER_NAME"] . "/player/" . $animation["id"] . "/\">Watch</a>" . $editLink . "<span>\"" . $animation["title"] . "\" " . $published . "<span></li>\n";
				}
				echo "</ul>";
			} else {
				echo "<p>No animations yet!</p>";
			}
		?>
	</div>
</div>
</div>
<?php include $_SERVER['DOCUMENT_ROOT'] . "/includes/layout/sidecolumn.php" ?>
</body>
</html>
