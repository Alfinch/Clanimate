<?php
if (!empty($_POST)) {
	foreach ($_POST as $key=>$value) {
		if (empty($value)) {
			$errors[] = "All fields are required.";
			break;
		}
	}
	if (empty($errors)) {
		if (trim($_POST['email']) !== trim($_POST['confirm_email'])) {
			$errors[] = "Your new email addresses do not match.";
		} else if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
			$errors[] = "A valid email address is required.";
		}
	}
}
?>
<div class="widget">
	<h2>Change Email Address</h2>
	<?php
	if ($_GET['change-email'] === 'success') {
	?>
	<p>You have successfully changed your email address to <?php echo $user_data['email'] ?>!</p>
	<p><a href="?">Return</a></p>
	<?php
	} else {
		if (!empty($_POST) && empty($errors)) {
			change_email($_SESSION["id"], trim($_POST['email']));
			header("Location: " . base_uri() . "?change-email=success");
			exit();
		} else if (!empty($errors)) {
			output_errors($errors);
		}
	?>
	<form action="" method="post">
		<p>New email address:</p>
		<input type="email" name="email">
		<p>Confirm new email address:</p>
		<input type="email" name="confirm_email">
		<input type="submit" value="Change Email Address">
	</form>
	<p><a href="?">Cancel</a></p>
	<?php } ?>
</div>
