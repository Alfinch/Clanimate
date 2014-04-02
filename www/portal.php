<?php
include $_SERVER['DOCUMENT_ROOT'] . "/core/init.php";
$_SESSION["page"] = "portal";
include$_SERVER['DOCUMENT_ROOT'] . "/includes/overall/top.php";
?>
<div id="middleSection" class="page">
	<div>
		<h1>Most recent animations by all users:</h1>
		<?php
			$animationList = list_animations(50);
			if ($animationList) {
				echo "<ul class=\"animationList\">";
				foreach($animationList as $animation) {
					echo "<li><a class=\"buttonLink\" href=\"http://" . $_SERVER["SERVER_NAME"] . "/player/" . $animation["id"] . "/\">Watch</a>" . "<span>&quot;" . $animation["title"] . "&quot; by <a class=\"underline\" href=\"http://" . $_SERVER["SERVER_NAME"] . "/user/" . username_from_id($animation["user_id"]) . "/\">" . username_from_id($animation["user_id"]) . "</a><span></li>\n";
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
