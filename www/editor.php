<?php
include $_SERVER['DOCUMENT_ROOT'] . "/core/init.php";
$_SESSION['page'] = "editor";
protect_page($page);
include $_SERVER['DOCUMENT_ROOT'] . "/includes/overall/top.php";
?>
<div id="subheader">
	<ul class="submenu">
		<li id="settings"><img src="http://<?php echo $_SERVER["SERVER_NAME"]; ?>/img/svg/settings_icon.svg" alt="Settings icon"/><span>Settings</span></li>
	</ul>
	<ul class="submenu">
		<li id="new"><img src="http://<?php echo $_SERVER["SERVER_NAME"]; ?>/img/svg/new_icon.svg" alt="New animation icon"/><span>New Animation</span></li>
		<li id="save"><img src="http://<?php echo $_SERVER["SERVER_NAME"]; ?>/img/svg/save_icon.svg" alt="Save animation icon"/><span>Save Animation</span></li>
		<li id="load"><img src="http://<?php echo $_SERVER["SERVER_NAME"]; ?>/img/svg/load_icon.svg" alt="Load animation icon"/><span>Load Animation</span></li>
		<li id="publish"><img src="http://<?php echo $_SERVER["SERVER_NAME"]; ?>/img/svg/publish_icon.svg" alt="Publish animation icon"/><span>Publish Animation</span></li>
	</ul>
	<ul class="submenu">
		<li id="play"><img src="http://<?php echo $_SERVER["SERVER_NAME"]; ?>/img/svg/play_icon.svg" alt="Play animation icon"/><span>Play</span></li>
		<li id="pause" class="selected"><img src="http://<?php echo $_SERVER["SERVER_NAME"]; ?>/img/svg/pause_icon.svg" alt="Pause animation icon"/><span>Pause</span></li>
		<li id="reset"><img src="http://<?php echo $_SERVER["SERVER_NAME"]; ?>/img/svg/reset_icon.svg" alt="Reset animation icon"/><span>Reset</li>
	</ul>
	<ul class="submenu">
		<!--<li id="zoomSelection"><img src="http://<?php echo $_SERVER["SERVER_NAME"]; ?>/img/svg/zoom_selection_icon.svg" alt="Zoom selection icon"/><span>Zoom Selection</span></li>-->
		<li id="zoomActual"><img src="http://<?php echo $_SERVER["SERVER_NAME"]; ?>/img/svg/zoom_actual_icon.svg" alt="Zoom actual icon"/><span>Zoom Actual</span></li>
		<li id="zoomStage"><img src="http://<?php echo $_SERVER["SERVER_NAME"]; ?>/img/svg/zoom_stage_icon.svg" alt="Zoom stage icon"/><span>Zoom Stage</span></li>
		<li id="zoomExtents"><img src="http://<?php echo $_SERVER["SERVER_NAME"]; ?>/img/svg/zoom_extents_icon.svg" alt="Zoom extents icon"/><span>Zoom Extents</span></li>
	</ul>
	<ul class="submenu">
		<li id="undo"><img src="http://<?php echo $_SERVER["SERVER_NAME"]; ?>/img/svg/undo_icon.svg" alt="Undo icon"/><span>Undo</span></li>
		<li id="redo"><img src="http://<?php echo $_SERVER["SERVER_NAME"]; ?>/img/svg/redo_icon.svg" alt="Redo icon"/><span>Redo</span></li>
	</ul>
</div>
<div id="middleSection" class="editor">
	<div id="toolbar">
		<div id="tools" class="vCenter">
			<div id="stageTools">
				<div id="pan" class="tool">
					<img src="http://<?php echo $_SERVER["SERVER_NAME"]; ?>/img/svg/pan_icon.svg" alt="Pan tool icon"/>
				</div>
				<!--<div id="manipulate" class="tool">
					<img src="http://<?php echo $_SERVER["SERVER_NAME"]; ?>/img/svg/manipulate_icon.svg" alt="Manipulate tool icon"/>
				</div>-->
			</div>
			<div id="drawingToolOptions">
				<div id="drawingToolOptionsButton">
					<div></div>
				</div>
			</div>
			<div id="drawingTools">
				<div id="brush" class="tool">
					<img src="http://<?php echo $_SERVER["SERVER_NAME"]; ?>/img/svg/brush_icon.svg" alt="Brush tool icon"/>
				</div>
				<div id="square" class="tool">
					<img src="http://<?php echo $_SERVER["SERVER_NAME"]; ?>/img/svg/square_icon.svg" alt="Square tool icon"/>
				</div>
				<div id="circle" class="tool">
					<img src="http://<?php echo $_SERVER["SERVER_NAME"]; ?>/img/svg/circle_icon.svg" alt="Circle tool icon"/>
				</div>
				<div id="line" class="tool">
					<img src="http://<?php echo $_SERVER["SERVER_NAME"]; ?>/img/svg/line_icon.svg" alt="Line tool icon"/>
				</div>
				<!--<div id="eraser" class="tool">
					<img src="http://<?php echo $_SERVER["SERVER_NAME"]; ?>/img/svg/eraser_icon.svg" alt="Eraser tool icon"/>
				</div>-->
			</div>
		</div>
		<div id="toolbarOverlay" class="hidden"></div>
	</div>
	<div id="canvasContainer">
		<canvas id="canvas"></canvas>
	</div>
</div>
<div id="bottomSection">
	<div id="addLayer">+</div>
	<div id="layerControls"></div>
	<div id="headerCells">
		<div id="indexCells"></div>
		<div id="pointerCells"></div>
	</div>
	<div id="layerRows"></div>
	<div id="timelineHScroll"><div></div></div>
	<div id="setFrames"><span>+</span></div>
	<div id="timelineVScroll"><div></div></div>
	<div id="timelineOverlay" class="hidden"></div>
</div>
</div>
<?php include $_SERVER['DOCUMENT_ROOT'] . "/includes/layout/sidecolumn.php" ?>
<div id="tooltip" class="hidden above">
	<span>123456789</span>
</div>

<div id="overlay" class="hidden">
	<div id="drawingToolOptionsDialog" class="hidden">
		<p id="drawingToolOptionsTitle">Drawing Options</p>
		<div id="colorRGB">
			<p>Red, green, blue</p>
			<div id="redComponent" class="slider"><span>R</span><div class="sliderTrack"><div class="sliderHandle"></div></div></div>
			<div id="greenComponent" class="slider"><span>G</span><div class="sliderTrack"><div class="sliderHandle"></div></div></div>
			<div id="blueComponent" class="slider"><span>B</span><div class="sliderTrack"><div class="sliderHandle"></div></div></div>
		</div>
		<div id="colorHSL">
			<p>Hue, Saturation, Lightness</p>
			<div id="hueComponent" class="slider"><span>H</span><div class="sliderTrack"><div class="sliderHandle"></div></div></div>
			<div id="saturationComponent" class="slider"><span>S</span><div class="sliderTrack"><div class="sliderHandle"></div></div></div>
			<div id="lightnessComponent" class="slider"><span>L</span><div class="sliderTrack"><div class="sliderHandle"></div></div></div>
		</div>
		<div>
			<p>Stroke Width</p>
			<div id="strokeWidth" class="slider"><span>0</span><div class="sliderTrack"><div class="sliderHandle"></div></div></div>
		</div>
	</div>
	<div id="overlayContainer" class="hidden">
		<div id="prompt" class="hidden">
			<p id="promptMessage"></p>
			<input id="promptInput" type="text" placeholder="placeholder" />
			<div id="promptButtons">
				<button id="promptButton1">Yes</button>
				<button id="promptButton2">No</button>
			</div>
		</div>
		<div id="settings" class="hidden">
		</div>
		<div id="save" class="hidden">
		</div>
		<div id="load" class="hidden">
		</div>
		<div id="publish" class="hidden">
		</div>
	</div>
</div>
<?php include $_SERVER['DOCUMENT_ROOT'] . "/includes/layout/editor_scripts.php" ?>
</body>
</html>
