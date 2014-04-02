<?php
include $_SERVER['DOCUMENT_ROOT'] . "/core/init.php";
$_SESSION['page'] = "portal";
if (isset($_GET) && !empty($_GET['id'])) {
	if (animation_exists($_GET['id'])) {
		if (animation_is_published($_GET['id']) || user_owns_animation($_SESSION['id'], $_GET['id'])) {
			$animationData = load_animation($_GET['id']);
			$script = "var projectData = JSON.stringify(" . $animationData . ");";
		} else {
			go_to_page($_SESSION['page']);
		}
	} else {
		go_to_page($_SESSION['page']);
	}
} else {
	go_to_page($_SESSION['page']);
}
include $_SERVER['DOCUMENT_ROOT'] . "/includes/overall/top.php";
?>
<div id="subheader">
	<ul class="submenu">
		<li id="play"><img src="http://<?php echo $_SERVER["SERVER_NAME"]; ?>/img/svg/play_icon.svg" alt="Play animation icon"/><span>Play</span></li>
		<li id="pause" class="selected"><img src="http://<?php echo $_SERVER["SERVER_NAME"]; ?>/img/svg/pause_icon.svg" alt="Pause animation icon"/><span>Pause</span></li>
		<li id="reset"><img src="http://<?php echo $_SERVER["SERVER_NAME"]; ?>/img/svg/reset_icon.svg" alt="Reset animation icon"/><span>Reset</li>
	</ul>
</div>
<div id="middleSection" class="player">
	<div id="canvasContainer">
		<canvas id="canvas"></canvas>
	</div>
</div>
</div>
<?php include $_SERVER['DOCUMENT_ROOT'] . "/includes/layout/sidecolumn.php" ?>
<div id="tooltip" class="hidden above">
	<span>123456789</span>
</div>

<div id="overlay" class="hidden">
	<div id="overlayContainer" class="hidden">
		<div id="prompt" class="hidden">
			<p id="promptMessage"></p>
			<input id="promptInput" type="text" placeholder="placeholder" />
			<div id="promptButtons">
				<button id="promptButton1">Yes</button>
				<button id="promptButton2">No</button>
			</div>
		</div>
	</div>
</div>
<script src="<?php echo "http://" . $_SERVER["SERVER_NAME"] . "/js/paper.js" ?>"  type="text/javascript"></script>
<script type="text/javascript">paper.install(window);</script>
<script src="<?php echo "http://" . $_SERVER["SERVER_NAME"] . "/js/player.js" ?>" type="text/javascript"></script>
<?php
echo <<<EOF
<script type="text/javascript">
	{$script}
</script>
EOF;
?>
</body>
</html>
