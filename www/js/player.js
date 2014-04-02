"use strict";

var

// Manages all animation data within Clanimate
data = (function() {
    var o = {},
    
    // Private variables
    
    cells            = [],
    layerIndex       = 0,
    layers           = 0,
    targetFrame      = 1,
    targetGroupFrame = null,
    targetGroup      = null,
    targetLayer      = 1,
    visibleGroups    = [],
    
    // Private functions
    
    // Returns a project layer with the given index
    // Returns false if no layer with the given index is found
    get_project_layer = function(index) {
        var i, l;
        for(i = 0; i < project.layers.length; i += 1) {
            l = project.layers[i];
            if(l.data.index === index) {
                return l;
            }
        }
        return false;
    },
    
    // Public functions
	
    // Loads a project from JSON and returns true
    // Returns false if unsuccessful
    from_JSON = function(json) {
        var i, j, o = JSON.parse(json);
		
		project.clear();
		project.importJSON(o.project);
		
		settings.set_all(o.settings);
		
		cells            = [];
		layerIndex       = project.layers[(project.layers.length - 1)].data.index;
		layers           = project.layers.length;
		targetGroupFrame = null;
		targetGroup      = null;
		visibleGroups    = [];
		
		for (i = 1; i < project.layers.length; i++) {
			project.layers[i].visible = true;
			cells[project.layers[i].data.index] = [];
			for (j = 0; j < project.layers[i].children.length; j++) {
				if (project.layers[i].children[j]._class === "Group") {
					cells[project.layers[i].data.index][project.layers[i].children[j].data.frame] = project.layers[i].children[j];
					project.layers[i].children[j].visible = false;
				}
			}
		}
		controller.select_cell(layerIndex, 1);
		
		controller.zoom_stage();
		
        return true;
    },
    
    // Returns the current target frame
    get_target_frame = function() {
        return targetFrame;
    },
    
    // Returns the current target layer
    get_target_layer = function() {
        return targetLayer;
    },
    
    // Targets the the cell at the given layer and frame and returns true
    // Targets the nearest previous cell with a group if the target cell is empty
    // Returns false if the target layer does not exist
    target_cell = function(layer, frame) {
        var i, j, g;
		
		// Check if the given layer actually exists
        if (cells[layer] == null) {
            return false;
        }
		
		// Set all visible groups to be invisible, clear the visibleGroups array
        for (i = 0; i < visibleGroups.length; i += 1) {
            visibleGroups[i].visible = false;
        }
        visibleGroups = [];
		
		// For each layer which is being used...
        for (i = 1; i < cells.length; i += 1) {
            if (cells[i] != null) {
			
				// For each cell starting with the current frame and counting backwards...
                for (j = frame; j > 0; j -= 1) {
				
					// If there is a group in this cell
                    g = cells[i][j];
                    if (g != null) {
					
						// Set it to visible
                        g.visible = true;
                        visibleGroups.push(g);
						
						// If this is the currently selected layer, set this group as the target group for drawing
                        if (i === layer) {
                            targetGroup = g;
                            targetGroupFrame = j;
                        }
						
						// Go to the next layer
                        break;
                    }
                }
            }
        }
        targetLayer = layer;
        targetFrame = frame;
        return true;
    },
    
    // Public objects
    
    // Contains all user configurable settings for the current project
    settings = (function() {
        var o = {},
        
        // Private variables
        
        values = {
			frames:      50,
            frameRate:   24,
            stageHeight: 450,
            stageWidth:  800,
			title:       "Untitled",
			saveID:      "false",
			published:   "false",
            color:       new Color(0),
            strokeWidth: 8,
			zoomPadding: 8
        },
        
        // Public functions
        
        // Returns the setting linked to the given key
        // Returns false if the setting is undefined
        get = function(key) {
            return values[key] || false;
        },
        
        // Changes the value of a setting linked to the given key
        // Returns false if the setting is undefined or the supplied value is of the wrong type
        set = function(key, value) {
			var i;
            if (typeof(value) === typeof(values[key])) {
                values[key] = value;
				if (key === "stageHeight" || key === "stageWidth") {
					i = project.activeLayer.index;
					project.layers[0].activate();
					project.layers[0].children[0].remove();
					new Path.Rectangle(new Point(0, 0), new Size(values.stageWidth, values.stageHeight));
					project.layers[0].children[0].fillColor = "#FFF";
					project.layers[i].activate();
				};
                return true;
            }
            return false;
        },
		
        // Changes the values of all settings based on a spec object
		set_all = function(spec) {
			var key;
			for (key in spec) {
				if (!set(key, spec[key])) return false;
			}
			return true;
		};
        
        o.get     = get;
        o.set     = set;
		o.set_all = set_all;
        
        return o;
    }());

	o.from_JSON         = from_JSON;
    o.get_target_frame  = get_target_frame;
    o.get_target_layer  = get_target_layer;
    o.target_cell       = target_cell;
    
    o.settings = settings;
    
    return o;
}()),

ui = (function() {
    var o = {},
    
    // Public functions
    
    // Displays a prompt to the user based on a supplied spec
    prompt = function(spec) {
        var overlay, overlayContainer, prompt,
            pm, pi, pb1, pb2,
        
        close = function() {
            overlay.classList.add("hidden");
            overlay.classList.remove("dim");
            overlayContainer.classList.add("hidden");
            prompt.classList.add("hidden");
            window.removeEventListener("keydown", enter_handler);
            overlay.removeEventListener("mouseup", pb2_handler);
            prompt.removeEventListener("mouseup", propagation_block);
            pb1.removeEventListener("mouseup", pb1_handler);
            pb2.removeEventListener("mouseup", pb2_handler);
        },
        
        enter_handler = function(e) {
            if (e.keyCode === 13) {
                e.preventDefault();
                pb1_handler(e);
            }
        },
        
        pb1_handler = function(e){
            var input;
            close();
            if (spec.button1.callback != null) {
                if (spec.input === true) {
                    input = pi.value || pi.getAttribute("placeholder");
                    spec.button1.callback(input);
                } else {
                    spec.button1.callback();
                }
            }
        },
        
        pb2_handler = function(e) {
            var input;
            close();
            if (spec.button2 != null && spec.button2.callback != null) {
                if (spec.input === true) {
                    input = pi.value || pi.getAttribute("placeholder");
                    spec.button2.callback(input);
                } else {
                    spec.button2.callback();
                }
            }
        },
        
        propagation_block = function(e) {
            e.stopPropagation();
        };
        
        overlay          = document.getElementById("overlay");
        overlayContainer = document.getElementById("overlayContainer");
        prompt           = document.getElementById("prompt");
        pm               = document.getElementById("promptMessage");
        pi               = document.getElementById("promptInput");
        pb1              = document.getElementById("promptButton1");
        pb2              = document.getElementById("promptButton2");
        
        // Display prompt
        overlay.classList.remove("hidden");
        overlay.classList.add("dim");
        overlayContainer.classList.remove("hidden");
        prompt.classList.remove("hidden");
        
        // Set up prompt
        
        window.addEventListener("keydown", enter_handler);
        overlay.addEventListener("mouseup", pb2_handler);
        prompt.addEventListener("mouseup", propagation_block);
        
        pm.innerHTML = spec.message || "";
        
        if (spec.input === true) {
            pi.classList.remove("hidden");
            pi.value = "";
            pi.setAttribute("placeholder", spec.placeholder);
            pi.focus();
        } else {
            pi.classList.add("hidden");
        }
        
        pb1.innerHTML = spec.button1.name;
        pb1.addEventListener("mouseup", pb1_handler);
        
        if (spec.button2 != null) {
            pb2.classList.remove("hidden");
            pb2.innerHTML = spec.button2.name;
            pb2.addEventListener("mouseup", pb2_handler);
        } else {
            pb2.classList.add("hidden");
        }
    },
    
    // Public objects
    
    // Manages the stage and visual aspects of paper.js
    stage = (function(){
        var o = {},
        
        // Private variables
        
        cc = document.getElementById("canvasContainer"),
        c  = document.getElementById("canvas"),
        
        // Public functions
        
		// Centers the stage on a given point
		center = function(x, y) {
			view.center = new Point(x, y);
		},
        
        // Clears, resizes and redraws the stage
        update = function() {
            var cw = parseFloat(getComputedStyle(cc).width),
                ch = parseFloat(getComputedStyle(cc).height);
                
            c.setAttribute("width",  cw);
            c.setAttribute("height", ch);
            
            view.viewSize = new Size(cw, ch);
            view.draw();
        },
		
		// Zooms the stage by a given factor
		zoom = function(z) {
			view.zoom = z;
		};
        
		o.center     = center;
        o.update     = update;
		o.zoom       = zoom;
        
        return o;
    }()),
    
	// Adds a tooltip to an element
    tooltip = (function() {
        var o = {},
        
        // Private variables
        
        delay          = 700,
        tooltipElement = document.getElementById("tooltip"),
        timeout,
        tooltipRect,
        tooltips       = [],
        
        // Private functions
        
        new_tooltip = function(element, message, position, target) {
            var o = {},
            
            // Private variables
            
            leftOffset,
            target     = target || element,
            targetRect,
            
            // Private functions
            
            mouse_move_handler = function() {
                tooltipElement.classList.add("hidden");
                clearTimeout(timeout);
                timeout = setTimeout(show_tooltip, delay);
            },
            
            mouse_out_handler = function() {
                clearTimeout(timeout);
                tooltipElement.classList.add("hidden");
            },
            
            mouse_over_handler = function() {
                timeout = setTimeout(show_tooltip, delay);
            },
            
            show_tooltip = function() {
                tooltipElement.classList.remove("hidden","above","right","below","left");
                tooltipElement.innerHTML = o.message;
                targetRect = target.getBoundingClientRect();
                tooltipRect = tooltipElement.getBoundingClientRect();
                
                switch (position) {
                    case "right":
                        tooltipElement.classList.add("right");
                        tooltipElement.style.left = (targetRect.left + targetRect.width + 7) + "px";
                        tooltipElement.style.top = targetRect.top + ((targetRect.height - tooltipRect.height) * 0.5) + "px";
                        break;
                    case "below":
                        tooltipElement.classList.add("below");
                        tooltipElement.style.top = (targetRect.bottom + 7) + "px";
                        tooltipElement.style.left = targetRect.left + ((targetRect.width - tooltipRect.width) * 0.5) + "px";
                        break;
                    case "left":
                        tooltipElement.classList.add("left");
                        tooltipElement.style.left = (targetRect.left - tooltipRect.width - 7) + "px";
                        tooltipElement.style.top = targetRect.top + ((targetRect.height - tooltipRect.height) * 0.5) + "px";
                        break;
                    default: // "above"
                        tooltipElement.classList.add("above");
                        tooltipElement.style.top = (targetRect.top - tooltipRect.height - 7) + "px";
                        tooltipElement.style.left = targetRect.left + ((targetRect.width - tooltipRect.width) * 0.5) + "px";
                        break;
                }
            },
            
            // Public functions
            
            remove = function(target) {
                element.removeEventListener("mousemove", mouse_move_handler);
                element.removeEventListener("mouseout", mouse_out_handler);
                element.removeEventListener("mouseover", mouse_over_handler);
            };
            
            // Setup
            
            element.addEventListener("mousemove", mouse_move_handler);
            element.addEventListener("mouseout", mouse_out_handler);
            element.addEventListener("mouseover", mouse_over_handler);
            
            // Assignment
            
            o.message  = message;
            o.remove   = remove;
            o.element  = element;
            o.position = position;
            o.target   = target;
            
            tooltips.push(o);
        },
        
        // Public functions
        
        remove = function(element) {
            var i;
            for (i = 0; i < tooltips.length; i += 1) {
                if (tooltips[i].element === element) {
                    tooltips[i].remove();
                }
            }
        },
        
        set = function(spec) {
            var i;
            for (i = 0; i < tooltips.length; i += 1) {
                if (tooltips[i].element === spec.element) {
                    tooltips[i].message  = spec.message;
                    tooltips[i].position = spec.position;
                    tooltips[i].target   = spec.target || spec.element;
                    return;
                }
            }
            new_tooltip(spec.element, spec.message, spec.position, spec.target);
        };
        
        o.set    = set;
        o.remove = remove;
        
        return o;
    }());
    
    o.prompt          = prompt;
	
    o.stage           = stage;
    o.tooltip         = tooltip;
        
    return o;
}()),

controller = (function(){
    var o = {},
    
    // Private variables
    playing = false,
    tickTimer,
    
    // Public functions
    
    // Pauses the animation if playing
    pause = function() {
        if (playing) {
            playing = false;
			document.getElementById("pause").classList.add("selected");
			document.getElementById("play").classList.remove("selected");
            window.clearInterval(tickTimer);
        }
    },
    
    // Plays the animation if paused
    play = function() {
        if (!playing) {
            playing = true;
			document.getElementById("play").classList.add("selected");
			document.getElementById("pause").classList.remove("selected");
            tickTimer = window.setInterval(function() {
                var newFrame = data.get_target_frame() + 1;
                if (newFrame > data.settings.get("frames")) {
                    select_frame(1);
                } else {
                    select_frame(newFrame);
                }
            }, 1000 / data.settings.get("frameRate"));
        }
    },
    
    // Selects the the cell at the given layer and frame
    select_cell = function(layerIndex, frameIndex) {
        data.target_cell(layerIndex, frameIndex);
        ui.stage.update();
    },
    
    // Selects the frame at the given index
    select_frame = function(frameIndex) {
        var layerIndex = data.get_target_layer();
        select_cell(layerIndex, frameIndex);
    },
	
	// Zooms in to show the stage as large as possible
	zoom_stage = function() {
		var sw = data.settings.get("stageWidth"),
			sh = data.settings.get("stageHeight"),
			zp = data.settings.get("zoomPadding") * 2,
			vw = view.viewSize.width - zp,
			vh = view.viewSize.height - zp,
			stageRatio = sw / sh,
			viewRatio  = vw / vh;
			
		ui.stage.center(sw * 0.5, sh * 0.5);
		
		// If the stage is wider than the view
		if (stageRatio > viewRatio) {
			ui.stage.zoom(vw / sw);
		} else {
			ui.stage.zoom(vh / sh);
		}
	};
	
    o.pause                = pause;
    o.play                 = play;
    o.select_cell          = select_cell;
    o.select_frame         = select_frame;
	o.zoom_stage           = zoom_stage;
    
    return o;
}());

(function() {

window.onload = function() {
    var play, pause, reset;
    
    paper.setup("canvas");
    
    // Give the hidden stage layer an index
    project.layers[0].data.index = 0;
    
    // Events
    
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
    
    // Window resize handler
    window.addEventListener("resize", function() {
        ui.stage.update();
		controller.zoom_stage();
    });
    
    // Tooltips
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