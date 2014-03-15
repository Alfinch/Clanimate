<?php
include $_SERVER['DOCUMENT_ROOT'] . "/core/init.php";
protect_page();
include$_SERVER['DOCUMENT_ROOT'] . "/includes/overall/top.php";
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
					<svg height="30" width="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
						<path fill="#333" d="m11.5,25c0.0143,1.46,8.36,1.56,8.25-0.063l-0.142-2.12s1.37-2.68,2.22-6.56l1.04-4.75c0.292-1.34-1.69-2.15-2.23-0.781l-1.55,4.25,0.545-5.97c0.167-1.83-2.41-2.54-2.61-0.562l-0.78,5.79-1.2-6.76c-0.326-1.84-2.82-1.8-2.58,0l0.906,6.87-2.61-5.78c-0.729-1.61-3.11-1.35-2.45,0.653l2.87,8.75c-1.28,0.393-2.4-1.77-3.33-2.59-1.11-0.982-3.19-0.457-1.92,1.18,0.642,0.828,1.04,1.54,1.91,3.07,0.389,0.681,0.517,1.11,0.921,1.78,0.701,1.16,2.74,2.81,2.74,2.81z"/>
					</svg>
				</div>
				<div id="manipulate" class="tool">
					<svg height="30" width="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
						<path fill="#333" d="m20,23.5c-0.591,0.998-1.91,1.63-3.07,1.71-0.395,0.026-0.974-0.246-1.09-0.625-0.76-2.51-1.08-3.18-1.91-4.5-0.336-0.532-0.993-0.616-1.36-0.426-1.11,0.571-1.89,1.11-3.09,2.42-0.588,0.646-1.55,0.169-1.59-0.603-0.232-4.51-0.405-8.07-0.24-13.8,0.0273-0.954,0.574-1.41,1.72-0.845,5.44,2.71,7.62,4.08,11.7,7.33,0.634,0.505,0.598,1.38-0.222,1.56-1.77,0.394-2.4,0.546-3.78,1.13-0.497,0.209-0.642,0.926-0.356,1.32,0.958,1.31,2.09,2.98,3.41,4.15,0.302,0.268,0.0878,0.858-0.118,1.21z"/>
					</svg>
				</div>
			</div>
			<div id="drawingToolOptions">
				<div id="drawingToolOptionsButton">
					<div></div>
				</div>
			</div>
			<div id="drawingTools">
				<div id="brush" class="tool">
					<svg height="30" width="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
						<path fill="#333" d="m4,15c0.568-1.74,2.49-2.48,4.16-2.71,2.57-0.358,4.93,0.946,7.21,1.91,1.84,0.69,3.7,1.51,5.69,1.56,1.17-0.201,1.46-1.72,2.65-1.89,1.4-0.129,2.9,0.803,3.26,2.19-0.597,2.01-2.56,3.28-4.49,3.8-2.52,0.551-4.92-0.655-7.21-1.54-1.84-0.728-3.71-1.52-5.69-1.73-1.14,0.126-1.76,1.43-2.96,1.39-1.26,0.182-2.79-0.717-2.72-2.11-0.006-0.298,0.0109-0.599,0.0944-0.887z"/>
					</svg>
				</div>
				<div id="square" class="tool">
					<svg height="30" width="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
						<path fill="#333" d="m7,6a2,2,0,0,0,-1.78,2.16c0.403,4.97,0.579,9.79,0,14.6a2,2,0,0,0,2.19,2.22c4.84-0.479,9.69-0.287,14.7,0.031a2,2,0,0,0,2.09,-1.72c0.788-5.3,0.477-10.3,0-15.5a2,2,0,0,0,-2.09,-1.81c-4.98,0.316-9.86,0.479-14.7,0a2,2,0,0,0,-0.406,0zm2.31,4.06c3.71,0.228,7.39,0.23,11,0.031,0.299,3.69,0.329,7.26-0.0312,10.8-3.64-0.198-7.3-0.227-11,0,0.277-3.66,0.239-7.26,0-10.8z"/>
					</svg>
				</div>
				<div id="circle" class="tool">
					<svg height="30" width="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
						<path fill="#333" d="m13,5c-2.13,0.167-3.98,1.27-5.31,2.72-1.78,1.93-2.73,4.56-2.84,7.31-0.232,5.68,4.56,11,10.4,10.2,2.98-0.419,5.41-1.35,7.16-3.09,1.74-1.74,2.58-4.18,2.69-6.94,0.111-2.83-1.03-5.42-2.97-7.06-2.83-2.4-5.82-3.38-9.12-3.12zm1.8,4c1.84,0.217,3.55,0.995,4.69,2.06,1.14,1.07,1.75,2.35,1.69,4-0.0829,2.11-0.589,3.37-1.5,4.28-0.911,0.911-2.44,1.59-4.91,1.94-3.04,0.428-5.98-2.78-5.84-6.06,0.0789-1.93,0.766-3.65,1.78-4.75,1.02-1.1,2.25-1.69,4.09-1.47z"/>
					</svg>
				</div>
				<div id="line" class="tool">
					<svg height="30" width="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
						<path fill="#333" d="m5,24c-0.766,0.766-0.8,2.14-0.0134,2.86,0.787,0.714,2.07,0.737,2.86-0.045l16.2-20c0.748-0.746,1.05-2.03,0.237-2.95-0.813-0.914-2.24-0.738-3.08,0.102z"/>
					</svg>
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
