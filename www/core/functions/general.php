<?php
function email($to, $subject, $body) {
	$headers  = "From: noreply@clanimate.com\r\n";
	$headers .= "MIME-Version: 1.0\r\n";
	$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
	mail($to, $subject, $body, $headers);
}

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
	$item = sanitize($item);
}

function sanitize($data) {
	return htmlentities(strip_tags(mysql_real_escape_string($data)));
}

function output_alerts($alerts) {
	$list = "";
	foreach($alerts as $alert) {
		$list .= "<li>" . $alert . "</li>\n";
	}
	echo "<div class=\"widget\"><ul class=\"alerts\">" . $list . "</ul></div>";
}

function output_errors($errors) {
	$list = "";
	foreach($errors as $error) {
		$list .= "<li>" . $error . "</li>\n";
	}
	echo "<div class=\"widget\"><ul class=\"errors\">" . $list . "</ul></div>";
}

function go_home() {
	header("Location: http://" . $_SERVER["SERVER_NAME"]);
}

function go_to_page($page, $username) {
	if (empty($page)) {
		go_home();
	} else {
		if ($page === 'profile' && isset($username)) {
			$page = $username;
		} else {
			$page = $page . ".php";
		}
		header("Location: http://" . $_SERVER["SERVER_NAME"] . "/" . $page);
	}
}
?>