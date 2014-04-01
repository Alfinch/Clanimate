<?php
include $_SERVER['DOCUMENT_ROOT'] . "/core/init.php";
$success = "false";
$errors = [];
$returnString = '';

if (!empty($_GET) && logged_in()) {
	if (!isset($_GET['user']) || !isset($_GET['private']) || !isset($_GET['limit'])) {
		$errors[] = "Invalid request.";
	} else {
		if ($_GET['user'] === "false") {
			$animList = list_animations($limit);
		} else {
			$animList = list_user_animations($_SESSION['id'], $_GET['private'], $_GET['limit']);
		}
		$success = "true";
	}
} else {
	$errors[] = "No data received.";
}

$returnString .= '{"success":' . $success . ',';
if ($success === "false")
$returnString .= '"error":"' . $errors[0] . '"';
else
$returnString .= '"list":' . json_encode($animList);
$returnString .= '}';

echo $returnString;
?>
