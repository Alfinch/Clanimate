//=========================//
//  Clanimate v2.2.15      //
//  Alfie Woodland         //
//  21/02/13               //
//=========================//

"use strict";

(function() {

window.onload = function() {
    var sw, sh, bg,
        layerIndex, layerName, frameIndex,
        i, initFrames = 20,
        toolButtons, toolOptionsButton, toolOptions,
        centerStage,
        play, pause,
        addLayer, setFrames;
    
    paper.setup("canvas");
    
    // Give the hidden stage layer an index
    project.layers[0].data.index = 0;
    
    // Draw the stage background
    sw = data.settings.get("stageWidth");
    sh = data.settings.get("stageHeight");
    bg = new Path.Rectangle(new Point(0, 0), new Size(sw, sh));
    bg.fillColor = "#FFF";
    
    // Add the initial frames
    data.set_frames(initFrames);
    ui.timeline.set_frames(initFrames);
    
    // Add the first project layer
    layerIndex = data.new_layer();
    layerName  = data.get_layer_name(layerIndex);
    frameIndex = data.get_target_frame();
    ui.timeline.new_layer(layerIndex, layerName);
    ui.timeline
        .get_layer(layerIndex)
        .get_cell(frameIndex)
        .select();
    
    // Select the brush tool
    controller.set_tool("brush");
	
	// Center the stage
	controller.center_stage();
    
    // Events
    
    // Tool buttons
    toolButtons = document.getElementsByClassName("tool");
    Array.prototype.forEach.call(toolButtons, function(el){
        ui.tooltip.set({
            element: el,
            message: el.getAttribute("id"),
            position: "right"
        });
        el.addEventListener("mouseup", function() {
            controller.set_tool(el.getAttribute("id"));
        });
    });
	
	// centerStage handler
    centerStage = document.getElementById("centerStage");
    centerStage.addEventListener("mouseup", function() {
		controller.center_stage();
    });
    
    // play / pause / reset handlers
    play = document.getElementById("play");
    play.addEventListener("mouseup", function() {
		play.classList.toggle("selected")
		if (play.classList.contains("selected")) {
			controller.play();
		} else {
			controller.pause();
		}
    });
    
    // addLayer handler
    addLayer = document.getElementById("addLayer");
    addLayer.addEventListener("mouseup", function() {
        controller.new_layer();
    });
    
    // addFrame handler
    setFrames = document.getElementById("setFrames");
    setFrames.addEventListener("mouseup", function() {
        controller.set_frames();
    });
    
    // Window resize handler
    window.addEventListener("resize", function() {
        ui.stage.update();
    });
    
    // Tooltips
    ui.tooltip.set({
        element: addLayer,
        message: "Add a new layer",
        position: "above"
    });
    ui.tooltip.set({
        element: setFrames,
        message: "Set number of frames",
        position: "above"
    });
};

}());
