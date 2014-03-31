<?php
include $_SERVER['DOCUMENT_ROOT'] . "/core/init.php";
$success = "false";
$returnString = '';

if (!empty($_GET) && logged_in()) {
	if (empty($_GET['id']) || empty($_GET['published'])) {
		$errors[] = "Invalid request.";
	} else {
		if (animation_exists($_GET['id'])) {
			if (user_owns_animation($_SESSION['id'], $_GET['id'])) {
				publish_animation($_GET['id'], $_GET['published']);
				$success = "true";
			} else {
				$errors[] = "You do not have permission to modify this animation.";
			}
		} else {
			$errors[] = "The requested animation does not exist.";
		}
	}
} else {
	$errors[] = "No data received.";
}

$returnString .= '{"success":' . $success;
if ($success === "false")
$returnString .= '",error":"' . $errors[0] . '"';
$returnString .= '}';

echo $returnString;
?>
