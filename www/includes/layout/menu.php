<ul id="menu">
	<li><a href="<?php echo "http://" . $_SERVER["SERVER_NAME"] . "/index/" ?>" <?php if ($_SESSION['page'] === 'index') echo 'class="selected"' ?>>Home</a></li>
	<li><a href="<?php echo "http://" . $_SERVER["SERVER_NAME"] . "/portal/" ?>" <?php if ($_SESSION['page'] === 'portal') echo 'class="selected"' ?>>Portal</a></li>
	<?php if (logged_in()) { ?>
	<li><a href="<?php echo "http://" . $_SERVER["SERVER_NAME"] . "/editor/" ?>" <?php if ($_SESSION['page'] === 'editor') echo 'class="selected"' ?>>Editor</a></li>
	<li><a href="<?php echo "http://" . $_SERVER["SERVER_NAME"] . "/user/" . $user_data['username'] ?>/" <?php if ($_SESSION['page'] === 'profile') echo 'class="selected"' ?>>Profile</a></li>
	<?php } ?>
</ul>
