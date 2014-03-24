<?php
if (!empty($_POST)) {
	foreach ($_POST as $key=>$value) {
		if (empty($value)) {
			$errors[] = "All fields are required.";
			break;
		}
	}
	if (empty($errors)) {
		if (validate_password($_POST['current_password'], $user_data['hash']) === false) {
			$errors[] = "The password you entered was incorrect.";
		}
		if (trim($_POST['password']) !== trim($_POST['confirm_password'])) {
			$errors[] = "Your new passwords do not match.";
		}
		if (strlen($_POST['password']) < 6) {
			$errors[] = "Your new password must be at least 6 characters long.";
		}
	}
}
?>
<div class="widget">
	<h2>Change Password</h2>
	<?php
	if ($_GET['change-password'] === 'success') {
	?>
	<p>You have successfully changed your password!</p>
	<p><a href="?">Return</a></p>
	<?php
	} else {
		if (!empty($_POST) && empty($errors)) {
			change_password($_SESSION["id"], trim($_POST['password']));
			header("Location: " . base_uri() . "?change-password=success");
			exit();
		} else if (!empty($errors)) {
			output_errors($errors);
		}
	?>
	<form action="" method="post">
		<p>Current password:</p>
		<input type="password" name="current_password">
		<p>New password:</p>
		<input type="password" name="password">
		<p>Confirm new password:</p>
		<input type="password" name="confirm_password">
		<input type="submit" value="Change Password">
	</form>
	<p><a href="?">Cancel</a></p>
	<?php } ?>
</div>
