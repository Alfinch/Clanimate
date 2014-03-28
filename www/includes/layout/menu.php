<ul id="menu">
	<li><a href="<?php echo "http://" . $_SERVER["SERVER_NAME"] . "/index.php" ?>">Home</a></li>
	<li><a href="<?php echo "http://" . $_SERVER["SERVER_NAME"] . "/portal.php" ?>">Portal</a></li>
	<?php if (logged_in()) { ?>
	<li><a href="<?php echo "http://" . $_SERVER["SERVER_NAME"] . "/editor.php" ?>">Editor</a></li>
	<li><a href="<?php echo "http://" . $_SERVER["SERVER_NAME"] . "/" . $user_data['username'] ?>">Profile</a></li>
	<?php } ?>
</ul>
