<?php
function animation_exists($id) {
	$id = (int)$id;
	$queryString = "select count(`id`) from `animations` where `id` = '$id'";
	$query = mysql_query($queryString);
	$result = $query ? mysql_result($query, 0) : 0;
	return $result === "1";
}

function animation_is_published($id) {
	$id = (int)$id;
	$queryString = "select count(`id`) from `animations` where `id` = '$id' and `published` = '1'";
	$query = mysql_query($queryString);
	$result = $query ? mysql_result($query, 0) : 0;
	return $result === "1";
}

function list_animations($limit) {
	$queryString = "select `id`, `user_id`, `title` from `animations` where `published` = 1 order by `id` desc";
	if ($limit > 0) $queryString .= " limit 0, $limit";
	$query = mysql_query($queryString);
	if ($query) {
		$anim_array = [];
		while ($row = mysql_fetch_array($query, MYSQL_ASSOC)) {
			$anim_array[] = $row;
		}
		return $anim_array;
	}
	return false;
}

function list_user_animations($user_id, $show_private, $limit) {
	$show_private = $show_private || false;
	$user_id = (int)$user_id;
	$queryString = "select `id`, `title`, `published` from `animations` where `user_id` = '$user_id' order by `id` desc";
	if ($limit > 0) $queryString .= " limit 0, $limit";
	$query = mysql_query($queryString);
	if ($query) {
		$anim_array = [];
		while ($row = mysql_fetch_array($query, MYSQL_ASSOC)) {
			if ($row["published"] === "1" || $show_private) {
				$anim_array[] = [
					"id"        => $row["id"],
					"title"     => $row["title"],
					"published" => $row["published"]
				];
			}
		}
		return $anim_array;
	}
	return false;
}

function load_animation($id) {
	$id = (int)$id;
	$queryString = "select `data` from `animations` where `id` = '$id'";
	$query = mysql_query($queryString);
	return $query ? mysql_result($query, 0) : false;
}

function publish_animation($id, $published) {
	$id = (int)$id;
	$published = ($published === "true" ? 1 : 0);
	$queryString = "update `animations` set `published` = $published where `id` = '$id'";
	$query = mysql_query($queryString);
	return $query ? true : false;
}

function save_animation($id, $data, $title) {
	$id    = (int)$id;
	$data  = mysql_real_escape_string($data);
	$title = sanitize($title);
	
	$queryString = "update `animations` set `data` = '$data', `title` = '$title' where `id` = '$id'";
	$query = mysql_query($queryString);
	return (mysql_affected_rows() > 0);
}

function save_new_animation($user_id, $title, $data) {
	$user_id = (int)$user_id;
	$title   = sanitize($title);
	$data  = mysql_real_escape_string($data);
	
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
