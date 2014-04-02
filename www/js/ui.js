"use strict";

var

ui = (function() {
    var o = {},
    
    // Public functions
    
    // Displays the settings dialog
    settings_dialog = function(spec) {
        var overlay, overlayContainer, settingsDialog, sb1, sb2,
			titleInput, frameRateInput, stageHeightInput, stageWidthInput,
        
        close = function() {
            overlay.classList.add("hidden");
            overlay.classList.remove("dim");
            overlayContainer.classList.add("hidden");
            settingsDialog.classList.add("hidden");
            window.removeEventListener("keydown", enter_handler);
            overlay.removeEventListener("mouseup", close);
            settingsDialog.removeEventListener("mouseup", propagation_block);
            sb1.removeEventListener("mouseup", sb1_handler);
            sb2.removeEventListener("mouseup", close);
			titleInput.value = null;
			frameRateInput.value = null;
			stageHeightInput.value = null;
			stageWidthInput.value = null;
        },
        
        enter_handler = function(e) {
            if (e.keyCode === 13) {
                e.preventDefault();
				sb1_handler();
            }
        },
        
        sb1_handler = function(e){
			if (titleInput.value) data.settings.set("title",       titleInput.value);
			if (frameRateInput.value) data.settings.set("frameRate",   parseInt(frameRateInput.value));
			if (stageHeightInput.value) data.settings.set("stageHeight", parseInt(stageHeightInput.value));
			if (stageWidthInput.value) data.settings.set("stageWidth",  parseInt(stageWidthInput.value));
            close();
        },
        
        propagation_block = function(e) {
            e.stopPropagation();
        };
        
        overlay          = document.getElementById("overlay");
        overlayContainer = document.getElementById("overlayContainer");
        settingsDialog   = document.getElementById("settingsDialog");
		titleInput       = document.getElementById("titleInput");
		frameRateInput   = document.getElementById("frameRateInput");
		stageHeightInput = document.getElementById("stageHeightInput");
		stageWidthInput  = document.getElementById("stageWidthInput");
		sb1              = document.getElementById("settingsButton1");
		sb2              = document.getElementById("settingsButton2");
        
		// Fill in values
		titleInput.setAttribute("placeholder", spec.title);
		frameRateInput.setAttribute("placeholder", spec.frameRate);
		stageHeightInput.setAttribute("placeholder", spec.stageHeight);
		stageWidthInput.setAttribute("placeholder", spec.stageWidth);
		
        // Display settings dialog
        overlay.classList.remove("hidden");
        overlay.classList.add("dim");
        overlayContainer.classList.remove("hidden");
        settingsDialog.classList.remove("hidden");
        
        // Set up settings dialog events
        window.addEventListener("keydown", enter_handler);
        overlay.addEventListener("mouseup", close);
        sb1.addEventListener("mouseup", sb1_handler);
        sb2.addEventListener("mouseup", close);
        settingsDialog.addEventListener("mouseup", propagation_block);
    },
    
    // Displays the load dialog containing a list of the user's animations
    load_dialog = function(animations) {
        var overlay, overlayContainer, loadDialog, loadList, cancelButton, i,
		listItem, listButton, listSpan, publishedIcon, published,
        
        close = function() {
            overlay.classList.add("hidden");
            overlay.classList.remove("dim");
            overlayContainer.classList.add("hidden");
            loadDialog.classList.add("hidden");
            window.removeEventListener("keydown", enter_handler);
            overlay.removeEventListener("mouseup", cancelButton_handler);
            loadDialog.removeEventListener("mouseup", propagation_block);
            cancelButton.removeEventListener("mouseup", cancelButton_handler);
			loadList.innerHTML = "";
        },
		
		load_handler = function(id) {
			close();
			
			// Fixes a bug where the prompt will not appear
			window.setTimeout( function() {
				prompt({
					message:      "Are you sure you want to load this animation?<br>All unsaved progress will be lost.",
					button1: {
						name:     "Yes",
						callback: function() {
							controller.load(id)
						}
					},
					button2: {
						name:     "No"
					}
				})
			}, 0 );
		},
        
        enter_handler = function(e) {
            if (e.keyCode === 13) {
                e.preventDefault();
				close();
            }
        },
        
        cancelButton_handler = function(e){
            close();
        },
        
        propagation_block = function(e) {
            e.stopPropagation();
        };
        
        overlay          = document.getElementById("overlay");
        overlayContainer = document.getElementById("overlayContainer");
        loadDialog       = document.getElementById("loadDialog");
        loadList         = document.getElementById("loadList");
        cancelButton     = document.getElementById("loadCancelButton");
		
		// Populate list
		for (i = 0; i < animations.length; i += 1) {
			published = animations[i].published === "1" ? true : false;
		
			listItem      = document.createElement("li");
			listButton    = document.createElement("button");
			listSpan      = document.createElement("span");
			if (published) publishedIcon = document.createElement("img");
			
			listButton.textContent = "Load";
			listButton.setAttribute("value", animations[i].id);
			listSpan.textContent = animations[i].title + " ";
			if (published) publishedIcon.setAttribute("src", "/img/svg/published_icon.svg")
			
			listItem.appendChild(listButton);
			listItem.appendChild(listSpan);
			if (published) listItem.appendChild(publishedIcon);
			loadList.appendChild(listItem);
			
			listButton.addEventListener("mouseup", function() {
				load_handler(this.value);
			});
		}
        
        // Display load dialog
        overlay.classList.remove("hidden");
        overlay.classList.add("dim");
        overlayContainer.classList.remove("hidden");
        loadDialog.classList.remove("hidden");
        
        // Set up load dialog events
        
        window.addEventListener("keydown", enter_handler);
        overlay.addEventListener("mouseup", cancelButton_handler);
        cancelButton.addEventListener("mouseup", cancelButton_handler);
        loadDialog.addEventListener("mouseup", propagation_block);
    },
    
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
		
        // Sets the mouse cursor visible on the stage
        set_cursor = function(style) {
			var validStyles = ["cursor", "draw", "grab", "grabbing", "none", "pointer"];
			if (validStyles.indexOf(style) != -1) {
				validStyles.forEach(function(item) {
					cc.classList.remove(item);
				});
				cc.classList.add(style);
				return true;
			}
			return false;
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
				span = 0,
            
            // Private variables
            
            indexCells = document.getElementById("indexCells"),
            indexCell  = document.createElement("div"),
            
            // Public functions
			
			get_span = function() {
				return span;
			},
            
            remove = function() {
                indexCells.removeChild(indexCell);
            };
			
			// Setup
            
            indexCell.classList.add("indexCell");
            indexCell.innerHTML = frameIndex;
            indexCells.appendChild(indexCell);
			
			do {
				span += 1;
				indexCell.style.width = ((span * 18) + ((span - 1) * 2) - 2) + "px";
			} while (indexCell.scrollWidth > indexCell.clientWidth);
            
			// Assignment
			
			o.get_span = get_span;
            o.remove   = remove;
            
            indexCellArray[frameIndex] = o;
        },
        
        // Creates new pointer cell on the timeline
        new_pointer_cell = function(frameIndex) {
            var o = {},
				span = 0,
            
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
            
			get_span = function() {
				return span;
			},
			
            remove = function() {
                pointers.removeChild(pointerCell);
            },
            
            select = function() {
                pointerCell.classList.add("selected");
            };
            
			// Setup
            
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
			
			// Assignment
			
            o.deselect = deselect;
            o.focus    = focus;
            o.defocus  = defocus;
            o.remove   = remove;
            o.select   = select;
            
            pointerCellArray[frameIndex] = o;
        },
		
		sort_layers = function() {
			layers.sort(function(a, b) {
				return a.get_index() - b.get_index();
			});
		},
        
        // Public functions
        
        // Returns the layer with the given index
        get_layer = function(index) {
            var i;
			for (i = 0; i < layers.length; i += 1) {
				if (layers[i].get_index() === index) {
					return layers[i];
				}
			}
			return false;
        },
        
        // Returns the top layer
		// Returns false when there are no layers
        get_top_layer = function() {
            var i;
			if (layers.length === 0) {
				return false;
			} else {
				return layers[layers.length - 1];
			}
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
			
			get_index = function() {
				return layerIndex;
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
                    if (frameIndex !== 1 &&
						this.classList.contains("selected") && (
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
                    get_layer(layerIndex).focus();
                });
                
                cell.addEventListener("mouseout", function(e) {
                    e.stopPropagation();
                    pointerCellArray[frameIndex].defocus();
                    get_layer(layerIndex).defocus();
                });
                
                cells[frameIndex] = o;
            },
            
            // Removes the ui elements for this layer
            remove = function() {
				var arrIndex = layers.indexOf(o);
                document.getElementById("layerControls")
                    .removeChild(layerControl);
                document.getElementById("layerRows")
                    .removeChild(layerCells);
				layers.splice(arrIndex,1);
                set_height();
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
			
			// Setup
            
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
            
            // Add new row to timeline
            layerCells.classList.add("layerCells");
            layerCells.setAttribute("data-index", layerIndex);
			if (layerRows.children.length > 0) {
				for (var i = 0; i < layerRows.children.length; i++) {
					if (layerRows.children[i].getAttribute("data-index") < layerIndex) {
						layerRows.insertBefore(layerCells, layerRows.children[i]);
						break;
					}
				}
			} else {
				layerRows.appendChild(layerCells);
			}
            
            // Add new cells to row
            for (i = 1; i <= frames; i += 1) {
                new_cell(i);
            }
            get_cell(1).set_empty_key();
            
            // Add html elements to dom
            layerControl.setAttribute("data-index", layerIndex);
			if (layerControls.children.length > 0) {
				for (var i = 0; i < layerControls.children.length; i++) {
					if (layerControls.children[i].getAttribute("data-index") < layerIndex) {
						layerControls.insertBefore(layerControl, layerControls.children[i]);
						break;
					}
				}
			} else {
				layerControls.appendChild(layerControl);
			}
            
            stage.update();
			
			// Assignment
            
            o.defocus   = defocus;
            o.deselect  = deselect;
            o.focus     = focus;
            o.get_cell  = get_cell;
			o.get_index = get_index;
            o.hide      = hide;
            o.new_cell  = new_cell;
            o.remove    = remove;
            o.rename    = rename;
            o.select    = select;
            o.unhide    = unhide;
            
            layers.push(o);
			sort_layers();
            set_height();
        },
	
		// Removes all of the current layers
		remove_layers = function(){
			var l;
			while(l = get_top_layer()) {
				l.remove();
			}
		},
        
        // Sets the number of frames in the animation
        set_frames = function(value) {
            var i, j;
			function cell_occluded(i, step) {
				step = step || 0;
				step += 1;
				if (indexCellArray[i-step] != null) {
					return (indexCellArray[i-step].get_span() > step);
				} else if (i === 1) {
					return false;
				} else {
					return cell_occluded(i, step);
				}
			}
            if(value > frames) {
                for (i = frames + 1; i <= value; i += 1) {
					if (!cell_occluded(i)) new_index_cell(i);
                    new_pointer_cell(i);
                    for (j = 0; j < layers.length; j += 1) {
                        layers[j].new_cell(i);
                    }
                }
            } else {
                for (i = frames; i > value; i -= 1) {
                    if (indexCellArray[i] != null) indexCellArray[i].remove();
                    pointerCellArray[i].remove();
                    for (j = 0; j < layers.length; j += 1) {
                        layers[j].get_cell(i).remove();
                    }
                }
            }
            frames = value;
        },
        
        // Resises the timeline and stage based on the number of layers
        set_height = function() {
            var base = 62,
                lNum = layers.length,
                ms, bs, h;
            
            ms = document.getElementById("middleSection");
            bs = document.getElementById("bottomSection");
            
            lNum = lNum > maxVisibleLayers ? maxVisibleLayers : lNum;
            h = base + (lNum * 30);
            
            ms.style.bottom = h + 2 + "px";
            bs.style.height = h + "px";
        },
		
		// Public objects
		
		// Scrollbars
		scrollbars = (function() {
            var o = {},
			
			// Private variables
			
			headerCellsElement = document.getElementById("headerCells"),
			layerRowsElement = document.getElementById("layerRows"),
			layerControlsElement = document.getElementById("layerControls"),
			hBar  = document.getElementById("timelineHScroll"),
			vBar  = document.getElementById("timelineVScroll"),
			hGrip = hBar.children[0],
			vGrip = vBar.children[0],
			
			// Public functions
			
			update_horizontal = function() {
				hGrip.style.width = (
					layerRowsElement.clientWidth *
					hBar.offsetWidth /
					layerRowsElement.scrollWidth
				) + "px";
				hGrip.style.left  = (
					layerRowsElement.scrollLeft *
					hBar.offsetWidth /
					layerRowsElement.scrollWidth
				) + "px";
			},
			
			update_vertical = function() {
				vGrip.style.height = (
					layerRowsElement.clientHeight *
					vBar.offsetHeight /
					layerRowsElement.scrollHeight
				) + "px";
				vGrip.style.top = (
					layerRowsElement.scrollTop *
					vBar.offsetHeight /
					layerRowsElement.scrollHeight
				) + "px";
			};
			
			// Setup
			
			hGrip.addEventListener("mousedown", function(e) {
				var downX = e.clientX,
					downS = parseFloat(getComputedStyle(hGrip)['left']),
					
				mouse_move_handler = function(e) {
					e.preventDefault();
					var dx   = e.clientX - downX,
						left = downS + dx,
						lMax = hBar.offsetWidth - hGrip.offsetWidth;
					
					left = left < 0 ? 0 : left > lMax ? lMax : left;
					hGrip.style.left = left + "px";
					
					headerCellsElement.scrollLeft =
					layerRowsElement.scrollLeft =
						layerRowsElement.scrollWidth *
						parseFloat(getComputedStyle(hGrip)['left']) /
						hBar.offsetWidth;
				},
				
				mouse_up_handler = function(e) {
					window.removeEventListener("mousemove", mouse_move_handler);
					window.removeEventListener("mouseup", mouse_up_handler);
				};
				
				e.stopPropagation();
				
				window.addEventListener("mousemove", mouse_move_handler);
				window.addEventListener("mouseup", mouse_up_handler);
			});
			
			vGrip.addEventListener("mousedown", function(e) {
				var downY = e.clientY,
					downS = parseFloat(getComputedStyle(vGrip)['top']),
					
				mouse_move_handler = function(e) {
					var dy   = e.clientY - downY,
						top  = downS + dy,
						tMax = vBar.offsetHeight - vGrip.offsetHeight;
					
					top = top < 0 ? 0 : top > tMax ? tMax : top;
					vGrip.style.top = top + "px";
					
					layerControlsElement.scrollTop =
					layerRowsElement.scrollTop =
						layerRowsElement.scrollHeight *
						parseFloat(getComputedStyle(vGrip)['top']) /
						vBar.offsetHeight;
				},
				
				mouse_up_handler = function(e) {
					window.removeEventListener("mousemove", mouse_move_handler);
					window.removeEventListener("mouseup", mouse_up_handler);
				};
				
				e.stopPropagation();
				
				window.addEventListener("mousemove", mouse_move_handler);
				window.addEventListener("mouseup", mouse_up_handler);
			});
			
			// Assignment
			
			o.update_vertical   = update_vertical;
			o.update_horizontal = update_horizontal;
			
			return o;
		}());
		
		// Assignment
        
		o.scrollbars    = scrollbars;
		o.set_height    = set_height;
        o.get_layer     = get_layer;
        o.get_top_layer = get_top_layer;
        o.new_layer     = new_layer;
		o.remove_layers = remove_layers;
        o.set_frames    = set_frames;
        
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
        
        toggle = function() {
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
    
	o.load_dialog     = load_dialog;
	o.settings_dialog = settings_dialog;
    o.prompt          = prompt;
	
    o.stage           = stage;
    o.timeline        = timeline;
    o.tooltip         = tooltip;
    o.toolOptions     = toolOptions;
        
    return o;
}());