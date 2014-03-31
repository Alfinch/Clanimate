<?php
function animation_exists($id) {
	$id = (int)$id;
	$queryString = "select count(`id`) from `animations` where `id` = '$id'";
	$query = mysql_query($queryString);
	$result = $query ? mysql_result($query, 0) : 0;
	return $result === "1";
}

function load_animation($id) {
	$id = (int)$id;
	$queryString = "select `data` from `animations` where `id` = '$id'";
	$query = mysql_query($queryString);
	return $query ? mysql_result($query, 0) : false;
}

function save_animation($id, $data, $title) {
	$id    = (int)$id;
	$data  = sanitize($data);
	$title = sanitize($title);
	
	$queryString = "update `animations` set `data` = '$data', `title` = '$title' where `id` = '$id'";
	$query = mysql_query($queryString);
	return (mysql_affected_rows() > 0);
}

function save_new_animation($user_id, $title, $data) {
	$user_id = (int)$user_id;
	$title   = sanitize($title);
	$data    = sanitize($data);
	
	$queryString = "insert into `animations` (`user_id`, `title`, `data`) values ('$user_id', '$title', '$data')";
	$query = mysql_query($queryString);
	return $query ? mysql_insert_id() : false;
}

function user_owns_animation($user_id, $id) {
	$queryString = "select count(`id`) from `animations` where `id` = '$id' and `user_id` = '$user_id'";
	$query = mysql_query($queryString);
	$result = $query ? mysql_result($query, 0) : 0;
	return $result === "1";
}
?>
