<?php
include $_SERVER['DOCUMENT_ROOT'] . "/core/init.php";
$success = "false";
$returnString = '';

if (!empty($_POST) && logged_in()) {
	if (empty($_POST['id']) || empty($_POST['data']) || empty($_POST['title'])) {
		$errors[] = "Sorry, an invalid save request was received. Try saving again.";
	} else {
		if ($_POST['id'] === "false" || !animation_exists($_POST['id'])) {
			$animationID = save_new_animation($_SESSION['id'], $_POST['title'], $_POST['data']);
			$success = "true";
		} else {
			if (user_owns_animation($_SESSION['id'], $_POST['id'])) {
				save_animation($_POST['id'], $_POST['data'], $_POST['title']);
				$animationID = $_POST['id'];
				$success = "true";
			} else {
				$errors[] = "You do not have permission to modify this animation.";
			}
		}
	}
} else {
	$errors[] = "Sorry, no data was received.<br> Try saving again.";
}

$returnString .= '{"success":' . $success . ',';
if ($success === "true")
$returnString .= '"id":"' . $animationID . '"';
if ($success === "false")
$returnString .= '"error":"' . $errors[0] . '"';
$returnString .= '}';

echo $returnString;
?>