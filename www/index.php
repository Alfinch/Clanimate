<?php
include $_SERVER['DOCUMENT_ROOT'] . "/core/init.php";
$_SESSION["page"] = "index";
include $_SERVER['DOCUMENT_ROOT'] . "/includes/overall/top.php";
?>
<div id="middleSection" class="page">
	<div>
		<img id="splashLogo" src="http://<?php echo $_SERVER["SERVER_NAME"]; ?>/img/svg/large_logo.svg" alt="large Clanimate logo" />
		<p>Welcome to Clanimate Alpha! Clanimate is an online animation authoring and sharing tool created with HTML5 and javasctipt; it is still in development and totally free to use. Take a look at the portal to see what other users are creating, or register to begin using the editor and creating your own animations.</p>
		<h1>Features in progress:</h1>
		<ul>
			<li>Onion skins (shadows of previous/next frames)</li>
			<li>Colour picker</li>
			<li>Hotkeys</li>
		</ul>
		<p>To suggest a new feature or report a bug, please log in and use the ideas and feedback form on the right.</p>
	</div>
</div>
</div>
<?php include $_SERVER['DOCUMENT_ROOT'] . "/includes/layout/sidecolumn.php" ?>
</body>
</html>
