<?php
function base_uri() {
	$uri_get_array = explode("?", "http://" . $_SERVER["SERVER_NAME"] . $_SERVER["REQUEST_URI"]);
	return $uri_get_array[0];
}

function logged_in_redirect() {
	if (logged_in()) {
		header("Location: http://" . $_SERVER["SERVER_NAME"] . "/index.php");
		exit();
	}
}

function protect_page() {
	if (!logged_in()) {
		header("Location: http://" . $_SERVER["SERVER_NAME"] . "/deny.php");
		exit();
	}
}

function array_sanitize(&$item) {
	$item = mysql_real_escape_string($item);
}

function sanitize($data) {
	return mysql_real_escape_string($data);
}

function output_errors($errors) {
	$list = "";
	foreach($errors as $error) {
		$list .= "<li class=\"error\">" . $error . "</li>\n";
	}
	echo "<ol class=\"errors\">" . $list . "</ol>";
}
?>