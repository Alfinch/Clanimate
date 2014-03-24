<?php
require_once("hash.php");

function change_email($id, $email) {
	$queryString = "update `users` set `email` = '$email' where `id` = $id";
	$query = mysql_query($queryString);
}

function change_password($id, $password) {
	$hash = create_hash($password);
	$queryString = "update `users` set `hash` = '$hash' where `id` = $id";
	$query = mysql_query($queryString);
}

function register_user($data) {
	array_walk($data, 'array_sanitize');
	$data['hash'] = create_hash($data['password']);
	unset($data['password']);
	
	$fieldsString = '`' . implode('`, `', array_keys($data)) . '`';
	$dataString   = '\'' . implode('\', \'', $data) . '\'';
	
	$queryString = "insert into `users` ($fieldsString) values ($dataString)";
	$query = mysql_query($queryString);
}

function total_users() {
	$queryString = "select count(`id`) from `users` where `active` = 1";
	$query = mysql_query($queryString);
	$result = mysql_result($query, 0);
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
	$result = mysql_result($query, 0);
	return $result === "1";
}

function email_exists($email) {
	$email = sanitize($email);
	$queryString = "select count(`id`) from `users` where `email` = '$email'";
	$query = mysql_query($queryString);
	$result = mysql_result($query, 0);
	return $result === "1";
}

function user_active($username) {
	$username = sanitize($username);
	$queryString = "select count(`id`) from `users` where `username` = '$username' and `active` = 1";
	$query = mysql_query($queryString);
	$result = mysql_result($query, 0);
	return $result === "1";
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