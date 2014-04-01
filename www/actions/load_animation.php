<?php
include $_SERVER['DOCUMENT_ROOT'] . "/core/init.php";
$animationData = "false";
$success = "false";
$returnString = '';

if (!empty($_GET) && logged_in()) {
	if (empty($_GET['id'])) {
		$errors[] = "Invalid request.";
	} else {
		if (animation_exists($_GET['id'])) {
			if (user_owns_animation($_SESSION['id'], $_GET['id']) || animation_is_published($_GET['id'])) {
				$animationData = load_animation($_GET['id']);
				$success = "true";
			} else {
				$errors[] = "You do not have permission to load this animation.";
			}
		} else {
			$errors[] = "The requested animation does not exist.";
		}
	}
} else {
	$errors[] = "No data received.";
}

$returnString .= '{"success":' . $success . ',';
if ($success === "false")
$returnString .= '"error":"' . $errors[0] . '"';
else
$returnString .= '"data":' . $animationData;
$returnString .= '}';

echo $returnString;
?>
