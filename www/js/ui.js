"use strict";

var

ui = (function() {
    var o = {},
    
    // Public functions
    
    // Displays a prompt to the user based on a supplied spec
    // Returns the user's response
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
		
        // Sets the mouse cursor visible on the stage
        set_cursor = function(style) {
            cc.classList.remove("cursor", "draw", "grab", "grabbing", "none", "pointer");
            cc.classList.add(style);
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
        o.set_cursor = set_cursor;
        o.update     = update;
		o.zoom       = zoom;
        
        return o;
    }()),
    
    // Manages the timeline
    timeline = (function(){
        var o = {},
        
        // Private variables
        
        frames           = 0,
        indexCellArray   = [],
        layers           = [],
        maxVisibleLayers = 5,
        pointerCellArray = [],
        selectedCell     = null,
        selectedLayer    = null,
        
        // Private functions
        
        // Creates new frame index cell on the timeline
        new_index_cell = function(frameIndex) {
            var o = {},
            
            // Private variables
            
            indexCells = document.getElementById("indexCells"),
            indexCell  = document.createElement("div"),
            
            // Public functions
            
            remove = function() {
                indexCells.removeChild(indexCell);
            };
            
            o.remove = remove;
            
            indexCell.classList.add("indexCell");
            indexCell.innerHTML = frameIndex;
            indexCells.appendChild(indexCell);
            
            indexCellArray[frameIndex] = o;
        },
        
        // Creates new pointer cell on the timeline
        new_pointer_cell = function(frameIndex) {
            var o = {},
            
            // Private variables
            
            pointers    = document.getElementById("pointerCells"),
            pointerCell = document.createElement("div"),
            
            // Public functions
            
            defocus = function() {
                pointerCell.classList.remove("hover");
            },
            
            deselect = function() {
                pointerCell.classList.remove("selected");
            },
            
            focus = function() {
                pointerCell.classList.add("hover");
            },
            
            remove = function() {
                pointers.removeChild(pointerCell);
            },
            
            select = function() {
                pointerCell.classList.add("selected");
            };
            
            o.deselect = deselect;
            o.focus    = focus;
            o.defocus  = defocus;
            o.remove   = remove;
            o.select   = select;
            
            pointerCell.classList.add("pointerCell");
            pointers.appendChild(pointerCell);
                
            pointerCell.addEventListener("mouseup", function(e) {
                e.stopPropagation();
                if(!this.classList.contains("selected")) {
                    controller.select_frame(frameIndex);
                }
            });
            
            pointerCell.addEventListener("mouseover", function(e) {
                e.stopPropagation();
                selectedLayer
                    .get_cell(frameIndex)
                    .focus();
            });
            
            pointerCell.addEventListener("mouseout", function(e) {
                e.stopPropagation();
                selectedLayer
                    .get_cell(frameIndex)
                    .defocus();
            });
            
            pointerCellArray[frameIndex] = o;
        },
        
        // Resises the timeline and stage based on the number of layers
        set_timeline_height = function() {
            var base = 62,
                lNum = data.get_layer_num(),
                ms, bs, h;
            
            ms = document.getElementById("middleSection");
            bs = document.getElementById("bottomSection");
            
            lNum = lNum > maxVisibleLayers ? maxVisibleLayers : lNum;
            h = base + (lNum * 30);
            
            ms.style.bottom = h + 2 + "px";
            bs.style.height = h + "px";
        },
        
        // Public functions
        
        // Returns the layer with the given index
        get_layer = function(index) {
            return layers[index];
        },
        
        // Returns the top layer
        get_top_layer = function() {
            var i = layers.lastIndexOf;
            return layers[i];
        },
        
        // Creates a new layer ui
        new_layer = function(layerIndex, name) {
            var o = {},
            
            // Private variables
            
            cells = [],
            layerCells    = document.createElement("div"),
            layerControl  = document.createElement("div"),
            layerControls = document.getElementById("layerControls"),
            layerRows     = document.getElementById("layerRows"),
            hidden        = false,
            hideButton    = document.createElement("div"),
            i,
            pointerRow,
            nameString    = document.createElement("span"),
            removeButton  = document.createElement("div"),
            selected      = false,
			
			// Private objects
			
			
            
            // Public functions
            
            defocus = function() {
                layerControl.classList.remove("hover");
            },
            
            deselect = function() {
                layerControl.classList.remove("selected");
                selected = false;
            },
            
            focus = function() {
                layerControl.classList.add("hover");
            },
            
            get_cell = function(index) {
                return cells[index];                
            },
            
            // Changes the hideButton graphic to hidden
            hide = function() {
                hideButton.classList.remove("hideLayer");
                hideButton.classList.add("unhideLayer");
            },
            
            // creates a new cell ui
            new_cell = function(frameIndex) {
                var o = {},
                
                cell = document.createElement("div"),
                
                defocus = function() {
                    cell.classList.remove("hover");
                },
                
                deselect = function() {
                    cell.classList.remove("selected");
                    pointerCellArray[frameIndex].deselect();
                },
                
                focus = function() {
                    if(!cell.classList.contains("selected")) {
                        cell.classList.add("hover");
                    }
                },
                
                remove = function() {
                    layerCells.removeChild(cell);
                },
                
                select = function() {
                    if (selectedCell != null) {
                        selectedCell.deselect();
                    }
                    cell.classList.add("selected");
                    pointerCellArray[frameIndex].select();
                    selectedCell = o;
                },
                
                set_empty = function() {
                    cell.classList.remove("emptyKeyCell");
                    cell.classList.remove("keyCell");
                },
                
                set_empty_key = function() {
                    cell.classList.remove("keyCell");
                    cell.classList.add("emptyKeyCell");
                },
                
                set_key = function() {
                    cell.classList.remove("emptyKeyCell");
                    cell.classList.add("keyCell");
                };
                
                o.defocus       = defocus;
                o.deselect      = deselect;
                o.focus         = focus;
                o.remove        = remove;
                o.select        = select;
                o.set_empty     = set_empty;
                o.set_empty_key = set_empty_key;
                o.set_key       = set_key;
                
                cell.classList.add("layerCell");
                layerCells.appendChild(cell);
                
                cell.addEventListener("mouseup", function(e) {
                    e.stopPropagation();
                    if (this.classList.contains("selected") && (
                        this.classList.contains("emptyKeyCell") ||
                        this.classList.contains("keyCell"))) {
                        controller.delete_keycell();
                    } else if(this.classList.contains("selected")) {
                        controller.new_keycell();
                    } else {
                        controller.select_cell(layerIndex, frameIndex);
                    }
                });
                
                cell.addEventListener("mouseover", function(e) {
                    e.stopPropagation();
                    pointerCellArray[frameIndex].focus();
                    layers[layerIndex].focus();
                });
                
                cell.addEventListener("mouseout", function(e) {
                    e.stopPropagation();
                    pointerCellArray[frameIndex].defocus();
                    layers[layerIndex].defocus();
                });
                
                cells[frameIndex] = o;
            },
            
            // Removes the ui elements for this layer
            remove = function() {
                document.getElementById("layerControls")
                    .removeChild(layerControl);
                document.getElementById("layerRows")
                    .removeChild(layerCells);
                set_timeline_height();
            },
            
            // Changes the nameString for this layer
            rename = function(name) {
                nameString.innerHTML = name;
                tooltip.set({
					element: nameString,
					message: name
				});
            },
            
			// Selects this layer
            select = function() {
                if (selectedLayer != null) {
                    selectedLayer.deselect();
                }
                layerControl.classList.add("selected");
                selectedLayer = o;
                selected = true;
            },
            
            // Changes the hideButton graphic to visible
            unhide = function() {
                hideButton.classList.remove("unhideLayer");
                hideButton.classList.add("hideLayer");
            };
            
            o.defocus  = defocus;
            o.deselect = deselect;
            o.focus    = focus;
            o.get_cell = get_cell;
            o.hide     = hide;
            o.new_cell = new_cell;
            o.remove   = remove;
            o.rename   = rename;
            o.select   = select;
            o.unhide   = unhide;
            
            // Create html elements
            
            nameString.innerHTML = name;
            hideButton.classList.add("hideLayer");
            removeButton.classList.add("removeLayer");
            layerControl.classList.add("layerControl");
            layerControl.appendChild(nameString);
            layerControl.appendChild(hideButton);
            layerControl.appendChild(removeButton);
            
            // removeButton handler
            removeButton.addEventListener("mouseup", function(e) {
                e.stopPropagation();
                controller.delete_layer(layerIndex);
            });
            
            // hideButton handler
            hideButton.addEventListener("mouseup", function(e) {
                e.stopPropagation();
                controller.toggle_layer(layerIndex);
            });
            
            // rename handler
            nameString.addEventListener("mouseup", function(e) {
                if(selected) {
                    e.stopPropagation();
                    controller.rename_layer(layerIndex);
                }
            });
            
            // control select handler
            layerControl.addEventListener("mouseup", function(e) {
                e.stopPropagation();
                controller.select_layer(layerIndex);
            });
            
            // control mouseover handler
            layerControl.addEventListener("mouseover", function(e) {
                e.stopPropagation();
                get_cell(data.get_target_frame()).focus();
            });
            
            // control mouseout handler
            layerControl.addEventListener("mouseout", function(e) {
                e.stopPropagation();
                get_cell(data.get_target_frame()).defocus();
            });
            
            // tooltip
            tooltip.set({
                element: nameString,
                message: name,
                position: "above",
                target: layerControl
            });
            
            // Add new row to table
            layerCells.classList.add("layerCells");
            layerRows.insertBefore(layerCells, layerRows.firstChild);
            
            // Add new cells to row
            for (i = 1; i <= frames; i += 1) {
                new_cell(i);
            }
            get_cell(1).set_empty_key();
            
            // Add html elements to dom
            layerControls.insertBefore(layerControl, layerControls.firstChild);
            
            // Add newLayer object to layers array
            layers[layerIndex] = o;
            
            // Select this new layer
            select();
            
            set_timeline_height();
            stage.update();
        },
        
        // Sets the number of frames in the animation
        set_frames = function(value) {
            var i, j, l;
            if(value > frames) {
                for (i = frames + 1; i <= value; i += 1) {
                    new_index_cell(i);
                    new_pointer_cell(i);
                    for (j = 1; j < layers.length; j += 1) {
                        l = layers[j];
                        if (l != null) {
                            l.new_cell(i);
                        }
                    }
                }
            } else {
                for (i = frames; i > value; i -= 1) {
                    indexCellArray[i].remove();
                    pointerCellArray[i].remove();
                    for (j = 1; j < layers.length; j += 1) {
                        l = layers[j];
                        if (l != null) {
                            l.get_cell(i).remove();
                        }
                    }
                }
            }
            frames = value;
        };
        
        o.get_layer     = get_layer;
        o.get_top_layer = get_top_layer;
        o.new_layer     = new_layer;
        o.set_frames    = set_frames;
        
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
    }()),
	
	// Manages the tool options dialog
    toolOptions = (function(){
        var o = {},
        
        // Private variables
        
		overlay            = document.getElementById("overlay"),
        toolOptionsElement = document.getElementById("drawingToolOptionsDialog"),
        toolOptionsButton  = document.getElementById("drawingToolOptionsButton"),
		sliders            = [],
		
		// Private objects
		
		// Creates a slider
		slider = function(spec) {
			var o = {},
			
			// Private variables
			
			sliderWidth,
			leftLimit,
			rightLimit,
			parent   = spec.parent,
			child    = spec.child,
			upper    = spec.upper,
			lower    = spec.lower || 0,
			value    = spec.initial || 0,
			callback = spec.callback,
			
			// Private functions
			
			mouse_down_handler = function(e) {
				window.addEventListener("mousemove", mouse_move_handler);
				window.addEventListener("mouseup", mouse_up_handler);
				mouse_move_handler(e);
			},
			
			mouse_move_handler = function(e) {
				var x = e.pageX - parent.getBoundingClientRect().left - leftLimit - child.clientWidth * 0.5;
				
				if (x < 0) {
					child.style.left = "0px";
					value = lower;
				} else if (x > sliderWidth) {
					child.style.left = sliderWidth + "px";
					value = upper;
				} else {
					child.style.left = x + "px";
					value = lower + ((parseFloat(child.style.left) / sliderWidth) * (upper - lower));
				}
				
				callback(value);
				set_slider_values();
				set_button_graphic();
			},
			
			mouse_up_handler = function() {
				window.removeEventListener("mousemove", mouse_move_handler);
				window.removeEventListener("mouseup", mouse_up_handler);
			},
			
			// Public functions
			
			set_values = function() {
				value = spec.set();
				sliderWidth = parent.clientWidth - child.clientWidth;
				leftLimit   = child.clientWidth * 0.5;
				rightLimit  = leftLimit + sliderWidth;
				child.style.left = ((sliderWidth / (upper - lower)) * (value - lower)) + "px";
			};
			
			// Setup
			
			parent.addEventListener("mousedown", mouse_down_handler);
			
			// Assignment
			
			o.set_values = set_values;
			
			return o;
		},
		
		// Private functions
		
		set_button_graphic = function() {
			toolOptionsButton.children[0].style.width =
			toolOptionsButton.children[0].style.height =
			data.settings.get("strokeWidth") + "px";
			toolOptionsButton.children[0].style.backgroundColor =
			data.settings.get("color").toCSS();
			
		},
		
		set_gradient = function (element, stops) {
			var value = "linear-gradient(to right," + stops.join(", ") + ");";
			var styleString = "background-image: " + value +
			"background-image: -o-" + value +
			"background-image: -ms-" + value +
			"background-image: -moz-" + value +
			"background-image: -webkit-" + value;
			element.setAttribute("style", styleString);
		},
		
		overlay_handler = function(e) {
			if(e.srcElement === overlay || e.target === overlay) {
				toggle();
			}
		},
		
		set_slider_values = function() {
			var i;
			for (i = 0; i < sliders.length; i += 1) {
				sliders[i].set_values();
			}
		},
        
        // Public functions
        
        toggle = function(e) {
            overlay.classList.toggle("hidden");
            toolOptionsElement.classList.toggle("hidden");
            if(toolOptionsElement.classList.contains("hidden")) {
                overlay.removeEventListener("mouseup", overlay_handler);
            } else {
                overlay.addEventListener("mouseup", overlay_handler);
				toolOptionsElement.style.top = toolOptionsButton.getBoundingClientRect().top - 80 + "px";
				set_slider_values();
            }
        };
        
        // Setup
        
        set_button_graphic();
		
        toolOptionsButton.addEventListener("mouseup", toggle);
        tooltip.set({
            element: toolOptionsButton,
            message: "Drawing options",
            position: "right"
        });
        
        sliders.push(
		slider({
            parent: document.getElementById("redComponent").querySelectorAll("div.sliderTrack")[0],
            child:  document.getElementById("redComponent").querySelectorAll("div.sliderHandle")[0],
            upper:  1,
            initial:  data.settings.get("color").red,
            callback: function(value) {
				var currentColor = data.settings.get("color");
				currentColor.red = value;
            },
			set: function() {
				var currentColor = data.settings.get("color"),
					color, stops = [];
				color = new Color(currentColor);
				color.red = 0;
				stops.push(color.toCSS());
				color.red = 1;
				stops.push(color.toCSS());
				set_gradient(document.querySelectorAll("#redComponent>div.sliderTrack")[0], stops);
				return currentColor.red;
			}
        }),
        slider({
            parent: document.getElementById("greenComponent").querySelectorAll("div.sliderTrack")[0],
            child:  document.getElementById("greenComponent").querySelectorAll("div.sliderHandle")[0],
            upper:  1,
            initial:  data.settings.get("color").green,
            callback: function(value) {
				var currentColor = data.settings.get("color");
				currentColor.green = value;
            },
			set: function() {
				var currentColor = data.settings.get("color"),
					color, stops = [];
				color = new Color(currentColor);
				color.green = 0;
				stops.push(color.toCSS());
				color.green = 1;
				stops.push(color.toCSS());
				set_gradient(document.querySelectorAll("#greenComponent>div.sliderTrack")[0], stops);
				return currentColor.green;
			}
        }),
        slider({
            parent: document.getElementById("blueComponent").querySelectorAll("div.sliderTrack")[0],
            child:  document.getElementById("blueComponent").querySelectorAll("div.sliderHandle")[0],
            upper:  1,
            initial:  data.settings.get("color").blue,
            callback: function(value) {
				var currentColor = data.settings.get("color");
				currentColor.blue = value;
            },
			set: function() {
				var currentColor = data.settings.get("color"),
					color, stops = [];
				color = new Color(currentColor);
				color.blue = 0;
				stops.push(color.toCSS());
				color.blue = 1;
				stops.push(color.toCSS());
				set_gradient(document.querySelectorAll("#blueComponent>div.sliderTrack")[0], stops);
				return currentColor.blue;
			}
        }),
        slider({
            parent: document.getElementById("hueComponent").querySelectorAll("div.sliderTrack")[0],
            child:  document.getElementById("hueComponent").querySelectorAll("div.sliderHandle")[0],
            upper:  360,
            initial:  data.settings.get("color").hue,
            callback: function(value) {
				var currentColor = data.settings.get("color");
				currentColor.hue = value;
            },
			set: function() {
				var currentColor = data.settings.get("color"),
					i, color, numStops = 10, stops = [];
				color = new Color(currentColor);
				for (i = 0; i < numStops; i++) {
					color.hue = i * (360 / (numStops - 1));
					stops.push(color.toCSS());
				}
				set_gradient(document.querySelectorAll("#hueComponent>div.sliderTrack")[0], stops);
				return currentColor.hue;
			}
        }),
        slider({
            parent: document.getElementById("saturationComponent").querySelectorAll("div.sliderTrack")[0],
            child:  document.getElementById("saturationComponent").querySelectorAll("div.sliderHandle")[0],
            upper:  1,
            initial:  data.settings.get("color").saturation,
            callback: function(value) {
				var currentColor = data.settings.get("color");
				currentColor.saturation = value;
            },
			set: function() {
				var currentColor = data.settings.get("color"),
					color, stops = [];
				color = new Color(currentColor);
				color.saturation = 0;
				stops.push(color.toCSS());
				color.saturation = 1;
				stops.push(color.toCSS());
				set_gradient(document.querySelectorAll("#saturationComponent>div.sliderTrack")[0], stops);
				return currentColor.saturation;
			}
        }),
        slider({
            parent: document.getElementById("lightnessComponent").querySelectorAll("div.sliderTrack")[0],
            child:  document.getElementById("lightnessComponent").querySelectorAll("div.sliderHandle")[0],
            upper:  1,
            initial:  data.settings.get("color").lightness,
            callback: function(value) {
				var currentColor = data.settings.get("color");
				currentColor.lightness = value;
            },
			set: function() {
				var currentColor = data.settings.get("color"),
					i, color, numStops = 5, stops = [];
				color = new Color(currentColor);
				for (i = 0; i < numStops; i++) {
					color.lightness = i * (1 / (numStops - 1));
					stops.push(color.toCSS());
				}
				set_gradient(document.querySelectorAll("#lightnessComponent>div.sliderTrack")[0], stops);
				return currentColor.lightness;
			}
        }),
        slider({
            parent: document.getElementById("strokeWidth").querySelectorAll("div.sliderTrack")[0],
            child: document.getElementById("strokeWidth").querySelectorAll("div.sliderHandle")[0],
            upper: 99,
			lower: 4,
            initial: data.settings.get("strokeWidth"),
            callback: function(value) {
				data.settings.set("strokeWidth", Math.floor(value));
            },
			set: function() {
				var strokeWidth = data.settings.get("strokeWidth");
                document.querySelectorAll("#strokeWidth>span")[0].innerHTML = strokeWidth;
				return strokeWidth;
			}
        }));
        
        // Assignment
        
        o.toggle = toggle;
        
        return o;
    }());
    
    o.prompt      = prompt;
    o.stage       = stage;
    o.timeline    = timeline;
    o.tooltip     = tooltip;
    o.toolOptions = toolOptions;
        
    return o;
}());