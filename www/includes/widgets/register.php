<?php
if (!empty($_POST)) {
	foreach ($_POST as $key=>$value) {
		if (empty($value)) {
			$errors[] = "All fields are required.";
			break;
		}
	}
	if (empty($errors)) {
		if (user_exists($_POST['username'])) {
			$errors[] = "The username '" . $_POST['username'] . "' is already in use.";
		}
		if (!ctype_alnum(str_replace(array('_', '-'), '', $_POST['username']))) {
			$errors[] = "Usernames can only contain letters, numbers, underscores and hyphens - no spaces, punctuation or special characters.";
		}
		if ($_POST['password'] !== $_POST['confirm_password']) {
			$errors[] = "Your passwords do not match.";
		}
		if (strlen($_POST['password']) < 6) {
			$errors[] = "Your password must be at least 6 characters long.";
		}
		if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
			$errors[] = "A valid email address is required.";
		} else if (email_exists($_POST['email'])) {
			$errors[] = "The email address '" . $_POST['email'] . "' is already in use.";
		}
	}
}
?>
<div class="widget">
	<h2>Register</h2>
	<?php
	if ($_GET['register'] === 'success') {
	?>
	<p>You have been registered successfully! A confirmation email will arrive shortly and allow you to activate your account.</p>
	<?php
	} else {
		if (!empty($_POST) && empty($errors)) {
			$register_data = array(
				'username' => $_POST['username'],
				'password' => $_POST['password'],
				'email'    => $_POST['email']
			);
			register_user($register_data);
			header("Location: " . base_uri() . "?register=success");
			exit();
		} else if (!empty($errors)) {
			output_errors($errors);
		}
	?>
	<form action="" method="post">
		<p>Username:</p>
		<input type="text" name="username">
		<p>Password:</p>
		<input type="password" name="password">
		<p>Confirm password:</p>
		<input type="password" name="confirm_password">
		<p>Email:</p>
		<input type="email" name="email">
		<input type="submit" value="Register">
	</form>
	<?php } ?>
</div>
