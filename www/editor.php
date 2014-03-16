<?php
$page = "editor";
include $_SERVER['DOCUMENT_ROOT'] . "/core/init.php";
protect_page($page);
include $_SERVER['DOCUMENT_ROOT'] . "/includes/overall/top.php";
?>
<div id="subheader">
	<ul class="submenu">
		<li><a href="#">Settings</a></li>
		<li><a href="#">New</a></li>
		<li><a href="#">Save</a></li>
		<li><a href="#">Load</a></li>
		<li><a href="#">Publish</a></li>
	</ul>
	<ul class="submenu">
		<li>Selection</li>
		<li>Actual</li>
		<li>Stage</li>
		<li>Extents</li>
	</ul>
	<ul class="submenu">
		<li>Undo</li>
		<li>Redo</li>
	</ul>
</div>
<div id="middleSection" class="editor">
	<div id="toolbar">
		<div id="tools" class="vCenter">
			<div id="stageTools">
				<div id="pan" class="tool">
					<img src="http://<?php echo $_SERVER["SERVER_NAME"]; ?>/img/svg/pan_icon.svg" alt="Pan tool icon"/>
				</div>
				<div id="manipulate" class="tool">
					<img src="http://<?php echo $_SERVER["SERVER_NAME"]; ?>/img/svg/manipulate_icon.svg" alt="Manipulate tool icon"/>
				</div>
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
			</div>
		</div>
		<div id="drawingToolOptionsDialog" class="hidden">
			<p id="drawingToolOptionsTitle">Drawing Tool Options</p>
			<div id="colorRGB">
				<p>Red, green, blue</p>
				<div id="strokeRed" class="colorSlider"><span>R</span><div class="sliderTrack"><div class="sliderHandle"></div></div></div>
				<div id="strokeGreen" class="colorSlider"><span>G</span><div class="sliderTrack"><div class="sliderHandle"></div></div></div>
				<div id="strokeBlue" class="colorSlider"><span>B</span><div class="sliderTrack"><div class="sliderHandle"></div></div></div>
			</div>
			<div id="colorHSL">
				<p>Hue, Saturation, Lightness</p>
				<div id="fillRed" class="colorSlider"><span>H</span><div class="sliderTrack"><div class="sliderHandle"></div></div></div>
				<div id="fillGreen" class="colorSlider"><span>S</span><div class="sliderTrack"><div class="sliderHandle"></div></div></div>
				<div id="fillBlue" class="colorSlider"><span>L</span><div class="sliderTrack"><div class="sliderHandle"></div></div></div>
			</div>
			<div id="strokeWidth">
				<p>Stroke Width: <span>0</span></p>
				<div id="strokeWidthSlider" class="sliderTrack"><div class="sliderHandle"></div></div>
			</div>
		</div>
	</div>
	<div id="canvasContainer">
		<canvas id="canvas"></canvas>
	</div>
</div>
<div id="bottomSection">
	<div id="timelineOptions">
		<div id="play"></div>
		<div id="pause"></div>
	</div>
	<div id="addLayer">+</div>
	<div id="layerControls"></div>
	<div id="timeline">
		<div id="indexCells"></div>
		<div id="pointerCells"></div>
		<div id="layerRows"></div>
	</div>
	<div id="timelineHScroll"><div></div></div>
	<div id="setFrames"><span>+</span></div>
	<div id="timelineVScroll"><div></div></div>
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
