<?php
require_once("hash.php");

function recover_account($email) {
	$email = sanitize($email);
	$password = substr(md5(microtime()), 0, 8);
	$hash = create_hash($password);
	
	$queryString = "select `username` from `users` where `email` = '$email'";
	$query = mysql_query($queryString);
	$username = mysql_result($query, 0);
	
	$queryString = "update `users` set `hash` = '$hash' where `email` = '$email'";
	$query = mysql_query($queryString);
	
	$email_body = <<<EOD
<html><body style="font-family: sans-serif;">
<p>Hello {$username}!,</p>
<p>You recently requested to recover your account on Clanimate.</p>
<p>Your username is <b>{$username}</b>.</p>
<p>Your password is <b>{$password}</b>.</p>
<p>Regards,<br>Alfie Woodland</p>
</html></body>
EOD;
	
	email($email, "Clanimate forgotten username", $email_body);
}

function activate($email, $email_code) {
	$email      = sanitize($email);
	$email_code = sanitize($email_code);
	
	$queryString = "update `users` set `active` = 1 where `email` = '$email' and `email_code` = '$email_code' and `active` = 0";
	return mysql_query($queryString);
}

function change_email($username, $email_code) {
	$username   = sanitize($username);
	$email_code = sanitize($email_code);
	
	$queryString = "update `users` set `email` = `new_email` where `username` = '$username' and `email_code` = '$email_code'";
	$query = mysql_query($queryString);
	return (mysql_affected_rows() > 0);
}

function confirm_email($id, $email) {
	$id = (int)$id;
	$email = sanitize($email);
	$email_code = md5($_POST['username'] + microtime());
	
	$queryString = "update `users` set `new_email` = '$email', `email_code` = '$email_code' where `id` = $id";
	$query = mysql_query($queryString);
	
	$queryString = "select `username` from `users` where `id` = $id";
	$query = mysql_query($queryString);
	$username = mysql_result($query, 0);
	
$email_body = <<<EOD
<html><body style="font-family: sans-serif;">
<p>Hello, {$username}!</p>
<p>You recently requested to change your email address to {$email} on Clanimate. Click the link below to confirm this.</p>
<p><a href="http://www.clanimate.com/actions/change_email.php?username={$username}&email_code={$email_code}">Confirm you new email address</a></p>
<p>Regards,<br>Alfie Woodland</p>
</html></body>
EOD;
	
	email($email, "Confirm change of email on Clanimate", $email_body);
}

function change_password($id, $password) {
	$hash = create_hash($password);
	$queryString = "update `users` set `hash` = '$hash' where `id` = $id";
	$query = mysql_query($queryString);
}

function register_user($data) {
	array_walk($data, 'array_sanitize');
	
	$data['hash'] = create_hash($data['password']);
	$data['email_code'] = md5($_POST['username'] + microtime());
	
	unset($data['password']);
	
	$fieldsString = '`' . implode('`, `', array_keys($data)) . '`';
	$dataString   = '\'' . implode('\', \'', $data) . '\'';
	
	$queryString = "insert into `users` ($fieldsString) values ($dataString)";
	$query = mysql_query($queryString);
	
$email_body = <<<EOD
<html><body style="font-family: sans-serif;">
<p>Hello, {$data['username']}!</p>
<p>Thank you for registering with Clanimate. Click the link below to activate your account and begin creating and sharing animations.</p>
<p><a href="http://www.clanimate.com/actions/activate.php?email={$data['email']}&email_code={$data['email_code']}">Activate your account</a></p>
<p>Keep in mind: Clanimate is still in Alpha! As a result there will be bugs, and some updates may break things. You can help to make Clanimate better by reporting problems and suggesting features.</p>
<p>Have fun,<br>Alfie Woodland</p>
</html></body>
EOD;
	
	email($data['email'], "Activate your Clanimate account", $email_body);
}

function total_users() {
	$queryString = "select count(`id`) from `users` where `active` = 1";
	$query = mysql_query($queryString);
	$result = $query ? mysql_result($query, 0) : 0;
	return $result;
}

function user_data($id) {
	$data = array();
	$id = (int)$id;
	$queryString = "select `username`, `hash`, `email` from `users` where `id` = $id";
	$query = mysql_query($queryString);
	$data = mysql_fetch_assoc($query);
	return $data;
}

function logged_in() {
	return isset($_SESSION["id"]);
}

function user_exists($username) {
	$username = sanitize($username);
	$queryString = "select count(`id`) from `users` where `username` = '$username'";
	$query = mysql_query($queryString);
	$result = $query ? mysql_result($query, 0) : 0;
	return $result === "1";
}

function email_exists($email) {
	$email = sanitize($email);
	$queryString = "select count(`id`) from `users` where `email` = '$email'";
	$query = mysql_query($queryString);
	$result = $query ? mysql_result($query, 0) : 0;
	return $result === "1";
}

function user_active($username) {
	$username = sanitize($username);
	$queryString = "select count(`id`) from `users` where `username` = '$username' and `active` = 1";
	$query = mysql_query($queryString);
	$result = mysql_result($query, 0);
	return $result === "1";
}

function id_from_username($username) {
	$username = sanitize($username);
	$queryString = "select `id` from `users` where `username` = '$username'";
	$query = mysql_query($queryString);
	if ($query) {
		$id = mysql_result($query, 0, 0);
		return $id;
	}
}

function id_from_email($email) {
	$email = sanitize($email);
	$queryString = "select `id` from `users` where `email` = '$email'";
	$query = mysql_query($queryString);
	if ($query) {
		$id = mysql_result($query, 0, 0);
		return $id;
	}
}

function login($username, $password) {
	$username = sanitize($username);
	$queryString = "select `id`, `hash` from `users` where `username` = '$username'";
	$query = mysql_query($queryString);
	$id = mysql_result($query, 0, 0);
	$hash = mysql_result($query, 0, 1);
	return validate_password($password, $hash) ? $id : false;
}
?>