//=========================//
//  Clanimate v2.2.15      //
//  Alfie Woodland         //
//  21/02/13               //
//=========================//

"use strict";

(function() {

window.onload = function() {
    var sw, sh, bg, i,
        layerIndex, layerName, frameIndex,
		settings,
		newAnim, save, load, publish,
        play, pause, reset, tbo, tlo,
		/*zoomSelection,*/ zoomActual, zoomStage, zoomExtents,
		undo, redo, onionSkin,
        toolButtons, toolOptionsButton, toolOptions,
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
    ui.timeline.set_frames(data.settings.get("frames"));
    
    // Add the first project layer
    layerIndex = data.new_layer("Layer 1", true);
    layerName  = data.get_layer_name(layerIndex);
    frameIndex = data.get_target_frame();
    ui.timeline
		.new_layer(layerIndex, layerName);
	ui.timeline
		.get_layer(layerIndex)
		.select();
    ui.timeline
        .get_layer(layerIndex)
        .get_cell(frameIndex)
        .select();
	ui.timeline.scrollbars
		.update_horizontal();
    
    // Select the brush tool
    controller.set_tool("brush");
	
	// Center the stage
	controller.zoom_stage();
    
    // Events
	
	// settings handler
    settings = document.getElementById("settings");
    settings.addEventListener("mouseup", function() {
		controller.show_settings_dialog();
    });
	
	// new handler
	newAnim = document.getElementById("new");
	newAnim.addEventListener("mouseup", function() {
		controller.new_animation();
	});
	
	// save handler
	save = document.getElementById("save");
	save.addEventListener("mouseup", function() {
		controller.save();
	});
	
	// load handler
	load = document.getElementById("load");
	load.addEventListener("mouseup", function() {
		controller.show_load_dialog();
	});
	
	// publish handler
	publish = document.getElementById("publish");
	publish.addEventListener("mouseup", function() {
		controller.publish();
	});
    
	// play / pause handlers
    play = document.getElementById("play");
    pause = document.getElementById("pause");
    play.addEventListener("mouseup", function() {;
		if (!play.classList.contains("selected")) {
			controller.play();
		}
    });
    pause.addEventListener("mouseup", function() {
		if (!pause.classList.contains("selected")) {
			controller.pause();
		}
    });
	
	// reset handler
	reset = document.getElementById("reset");
    reset.addEventListener("mouseup", function() {
		controller.pause();
		controller.select_frame(1);
    });
	
	// zoomSelection handler
	/*
	zoomSelection = document.getElementById("zoomSelection");
	zoomSelection.addEventListener("mouseup", function() {
		controller.zoom_selection();
	}); */
	
	// zoomActual handler
	zoomActual = document.getElementById("zoomActual");
	zoomActual.addEventListener("mouseup", function() {
		controller.zoom_actual();
	});
	
	// zoomStage handler
	zoomStage = document.getElementById("zoomStage");
	zoomStage.addEventListener("mouseup", function() {
		controller.zoom_stage();
	});
	
	// zoomExtents handler
	zoomExtents = document.getElementById("zoomExtents");
	zoomExtents.addEventListener("mouseup", function() {
		controller.zoom_extents();
	});
	
	// undo handler
	undo = document.getElementById("undo");
	undo.addEventListener("mouseup", function() {
		controller.undo();
	});
	
	// redo handler
	redo = document.getElementById("redo");
	redo.addEventListener("mouseup", function() {
		controller.redo();
	});
	
	// redo handler
	onionSkin = document.getElementById("onionSkin");
	onionSkin.addEventListener("mouseup", function() {
		controller.toggle_onion_skin();
	});
    
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
	toolOptionsButton = document.getElementById("drawingToolOptionsButton");
	ui.tooltip.set({
		element: toolOptionsButton,
		message: "Drawing options",
		position: "right"
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
        ui.stage
			.update();
		controller
			.zoom_stage();
		ui.timeline.scrollbars
			.update_horizontal();
    });
	
	window.onbeforeunload = function(e) {
		return "If you go now any unsaved data will be lost!";
	};
    
    // Tooltips
    ui.tooltip.set({
        element: settings,
        message: "Animation settings",
        position: "above"
    });
    ui.tooltip.set({
        element: newAnim,
        message: "Create a new animation",
        position: "above"
    });
    ui.tooltip.set({
        element: save,
        message: "Save the current animation",
        position: "above"
    });
    ui.tooltip.set({
        element: load,
        message: "Load a previously saved animation",
        position: "above"
    });
    ui.tooltip.set({
        element: publish,
        message: "Publish the current animation",
        position: "above"
    });
    ui.tooltip.set({
        element: play,
        message: "Play",
        position: "above"
    });
    ui.tooltip.set({
        element: pause,
        message: "Pause",
        position: "above"
    });
    ui.tooltip.set({
        element: reset,
        message: "Go back to the first frame",
        position: "above"
    });
    /* ui.tooltip.set({
        element: zoomSelection,
        message: "Zoom in on the current selection",
        position: "above"
    });*/
    ui.tooltip.set({
        element: zoomActual,
        message: "Zoom to actual size",
        position: "above"
    });
    ui.tooltip.set({
        element: zoomStage,
        message: "Zoom to fit the entire stage",
        position: "above"
    });
    ui.tooltip.set({
        element: zoomExtents,
        message: "Zoom to fit everything in the current frame",
        position: "above"
    });
    ui.tooltip.set({
        element: undo,
        message: "Undo",
        position: "above"
    });
    ui.tooltip.set({
        element: redo,
        message: "Redo",
        position: "above"
    });
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
	
	blankProject = data.to_JSON();
	
	(function(){
		var exists;
		try {
			if (projectData)
				exists = true;
		} catch(e) { exists = false; }
		if (exists) {
			data.from_JSON(projectData);
		}
	}());
};

}());
