"use strict";

var

// Manages all animation data within Clanimate
data = (function() {
    var o = {},
    
    // Private variables
    
    cells            = [],
    frames           = 0,
    layerIndex       = 0,
    layers           = 0,
    targetFrame      = 1,
    targetGroupFrame = null,
    targetGroup      = null,
    targetLayer      = 1,
	undoStack        = [],
	redoStack        = [],
    visibleGroups    = [],
    
    // Private functions
	
	// Adds an action to the undo stack
	add_action = function(action) {
		undoStack.push(action);
		redoStack = [];
		console.log(undoStack);
	},
    
	// Adds a path to the current target group
	add_stroke = function(stroke, subtract) {
		var i, j, color, splitPaths, subtract = subtract || false,
			paths, strokeColor = stroke.fillColor,
			
			action = {
				type: "group",
				group: targetGroup,
				oldGroup: targetGroup.clone(false)
			};
		
		paths = targetGroup.removeChildren();
		stroke.remove();
			
		console.log("===== Adding stroke =====");
		
		// For each path in the current target group...
		for (i = 0; i < paths.length; i += 1) {
		
			// If the stroke intersects...
			if (paths[i].hitTest(stroke.firstSegment.point)  != null ||
				paths[i].getIntersections(stroke).length > 0) {
			
				console.log("Hit at path " + (i + 1) + "!");
				
				// If the colours of this path and the stroke match, unite them
				if (paths[i].fillColor.equals(stroke.fillColor) && subtract === false) {
				
					console.log("Color match - uniting paths.");
					
					stroke.remove();
					stroke = stroke.unite(paths[i]);
					stroke.fillColor = strokeColor;
				// If the colours do not match, subtract the stroke from the path uderneath
				} else {
				
					console.log("No match - subtracting from path.");
					
					color = paths[i].fillColor;
					paths[i] = paths[i].subtract(stroke);
					paths[i].fillColor = color;
					console.log("Type is " + paths[i]._type + " after subtract.");
					
					// If the path is compound, seperate the children then add them to the target group individually
					if (paths[i]._type === "compound-path") {
						splitPaths = split_compound_path(paths[i]);
						for (j = 0; j < splitPaths; j += 1) {
							splitPaths[j].fillColor = color;
							splitPaths[j].selectedColor = "#FF3333";
							targetGroup.addChild(splitPaths[j]);
						}
					
					// If the path is not compound, add it to the target group
					} else {
						paths[i].selectedColor = "#FF3333";
						targetGroup.addChild(paths[i]);
					}
				}
			} else {
				paths[i].selectedColor = "#FF3333";
				targetGroup.addChild(paths[i]);
			}
		}
		if (subtract === false) {
			console.log("Adding new stroke to target group.");
			
			stroke.fillColor = strokeColor;
			stroke.selectedColor = "#FF3333";
			targetGroup.addChild(stroke);
		}
		
		action.newGroup = targetGroup.clone(false);
		add_action(action);
	},
	
	// Separates all disconnected pathItems from a compound path
	// Returns an array of pathItems
	split_compound_path = function(compoundPath) {
		var i, j, k, compoundChildren, returnPaths = [], hits = [];
	
		console.log("Splitting path into " + compoundChildren.length + " children");
		
		compoundChildren = compoundPath.removeChildren();
		for (i = 0; i < compoundChildren.length; i += 1) {
			hits[i] = [];
		}
		
		console.log("Calculating hirarchy");
		
		// For every possible combination of paths
		for (i = 0; i < compoundChildren.length; i += 1) {
			for (j = i + 1; j < compoundChildren.length; j += 1) {
			
				// If the second path is inside the first path
				if (compoundChildren[i].hitTest(compoundChildren[j].firstSegment.point)  != null) {
					hits[i].push(j);
					
				// If the first path is inside the second path
				} else if (compoundChildren[j].hitTest(compoundChildren[i].firstSegment.point)  != null) {
					hits[j].push(i);
				}
			}
		}
		
		console.log(hits);
		
		hits.sort(function(a, b) {
			return a.length - b.length;
		});
		
		console.log(hits);
		
		for (i = 0; i < hits.length; i += 1) {
			for (j = 0; j < hits[i].length; j += 1) {
				for (k = i; k < hits.length; k += 1) {
					hits.splice(hits.indexOf(hits[i][j]), 1);
				}
			}
		}
		
		for (i = 0; i < hits.length; i += 1) {
			if (hits[i].length > 1) {
				returnPaths.push(
				);
			} else {
			}
		}
		
		return returnPaths;
	},
    
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
    
    // Returns the top project layer
    // Returns false if there are no layers
    get_top_project_layer = function() {
        if(project.layers.length === 0) {
            return false;
        } else {
            return project.layers.slice(-1)[0];
        }
    },
    
    // Public functions
	
    // Removes the group at the current target cell and returns true
    // Returns false if the current target cell does not contain a group
    delete_group = function(layer, frame) {
        if (cells[layer][frame] != null) {
            cells[layer][frame].remove();
            cells[layer][frame] = undefined;
            target_cell(targetLayer, targetFrame);
            return true;
        }
        return false;
    },
    
    // Removes the layer with the given index and returns true
    // Returns false if the layer does not exist
    delete_layer = function(layer) {
        var l, i;
        if (cells[layer] != null) {
            cells[layer] = undefined;
            l = get_project_layer(layer);
            l.remove();
            layers -= 1;
            l = get_top_project_layer();
            i = l.data.index;
            controller.select_layer(i);
            return true;
        }
        return false;
        
    },
    
    // Loads a project from JSON and returns true
    // Returns false if unsuccessful
    from_JSON = function(json) {
        var o = JSON.parse(json);
    },
	
	// Returns the bounding rectangle for everything in the current frame
	// Returns false if the frame is empty
	get_frame_extents = function() {
		var i, b,
			x1 = 0,
			y1 = 0,
			x2 = settings.get("stageWidth"),
			y2 = settings.get("stageHeight");
		if (visibleGroups.length === 0) return false;
		for (i = 0; i < visibleGroups.length; i++) {
			b = visibleGroups[i].bounds;
			if (x1 > b.x)            x1 = b.x;
			if (y1 > b.y)            y1 = b.y;
			if (x2 < b.x + b.width)  x2 = b.x + b.width;
			if (y2 < b.y + b.height) y2 = b.y + b.height;
		}
		return new Rectangle(x1, y1, x2 - x1, y2 - y1);
	},
    
    // Returns the current number of frames
    get_frame_num = function() {
        return frames;
    },
    
    // Returns the frame of the current target group
    get_group_frame = function() {
        return targetGroupFrame;
    },
    
    // Returns the name of the layer with the given index
    // Returns false if the layer does not exist
    get_layer_name = function(layer) {
        var l = get_project_layer(layer);
        return l ? l.data.name : false;
    },
    
    // Returns the current number of layers
    get_layer_num = function() {
        return layers;
    },
    
    // Returns the current target frame
    get_target_frame = function() {
        return targetFrame;
    },
    
    // Returns the current target layer
    get_target_layer = function() {
        return targetLayer;
    },
    
    // Hides the layer with the given index and returns true
    // Returns false if the layer does not exist
    hide_layer = function(layer) {
        var l;
        if (cells[layer] != null) {
            l = get_project_layer(layer);
            l.visible = false;
            return true;
        }
        return false;
    },
    
    // Returns true if the layer with the given index is visible
    // Returns false otherwise
    is_layer_visible = function(layer) {
        var l = get_project_layer(layer);
        if (l !== false && l.visible) {
            return true;
        }
        return false;
    },
    
    // Creates a new group in the current target cell and retruns true
    // Returns false if the cell is already occupied by a group
    new_group = function(layer, frame) {
        var g, l;
        if (cells[layer][frame] == null) {
            g = new Group();
			g.data.layer = layer;
			g.data.frame = frame;
            l = get_project_layer(layer);
            cells[layer][frame] = g;
            targetGroup = g;
            l.addChild(g);
            target_cell(targetLayer, targetFrame);
            return true;
        }
        return false;
    },
    
    // Creates a new layer at the top of the stack and returns its index
    new_layer = function(name) {
        var layer = new Layer();
        layerIndex += 1;
        layers += 1;
        layer.data.index = layerIndex;
        layer.data.name = name != null ? name : "Layer " + layerIndex;
        cells[layerIndex] = [];
		new_group(layerIndex, 1);
        target_cell(layerIndex, targetFrame);
        return layerIndex;
    },
    
    // Redoes the previously undone action and returns true
    // Returns false if there is nothing to redo
    redo = function() {
		if (redoStack.length === 0) return false;
        var i, action = redoStack.pop();
		
		if (action.type === "group") {
			if (action.oldGroup === false) {
				
			} else {
				action.group.removeChildren();
				for (i = 0; i < action.newGroup.children.length; i += 1) {
					action.newGroup.children[i].copyTo(action.group);
				}
				if (action.group.children.length > 0) {
					ui.timeline
						.get_layer(action.group.data.layer)
						.get_cell(action.group.data.frame)
						.set_key();
				}
			}
			
		} else if (action.type === "layer") {
			
		} else if (action.type === "setting") {
			action.redo();
		}
		
		undoStack.push(action);
		return true;
    },
    
    // Renames the layer with the given index and returns true
    // Returns false if the layer does not exist
    rename_layer = function(index, name) {
        var l = get_project_layer(index);
        if (l !== false) {
            l.data.name = name;
            return true;
        }
        return false;
    },
    
    // Set the number of frames in the animation to the specified value
    set_frames = function(value) {
        frames = value > 0 ? value : 1;
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
    
    // Returns the current project as JSON
    // Returns false if unsuccessful
    to_JSON = function() {
        var json, o = {};
        json = JSON.stringify(o);
        return json;
    },
    
    // Undoes the previous action and returns true
    // Returns false if there is nothing to undo
    undo = function() {
		if (undoStack.length === 0) return false;
		var i, action = undoStack.pop();
		
		if (action.type === "group") {
			action.group.removeChildren();
			for (i = 0; i < action.oldGroup.children.length; i += 1) {
				action.oldGroup.children[i].copyTo(action.group);
			}
			if (action.group.children.length === 0) {
                ui.timeline
                    .get_layer(action.group.data.layer)
                    .get_cell(action.group.data.frame)
                    .set_empty_key();
			}
			
		} else if (action.type === "set") {
			action.undo();
		}
		
		redoStack.push(action);
		return true;
    },
    
    // Unhides the layer with the given index and returns true
    // Returns false if the layer does not exist
    unhide_layer = function(layer) {
        var l;
        if (cells[layer] != null) {
            l = get_project_layer(layer);
            l.visible = true;
            return true;
        }
        return false;
    },
    
    // Public objects
    
    // Contains all user configurable settings for the current project
    settings = (function() {
        var o = {},
        
        // Private variables
        
        values = {
            frameRate:   24,
            stageHeight: 450,
            stageWidth:  800,
            color: new Color(0),
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
            if (typeof(value) === typeof(values[key])) {
                values[key] = value;
                return true;
            }
            return false;
        };
        
        o.get = get;
        o.set = set;
        
        return o;
    }()),
    
    // Contains all of the drawing tools
    tools = (function(){
        var o = {},
        
        // Private variables
        
        tools = {},
        defaultTool = "brush",
        currentTool = defaultTool,
        
        // Public functions
        
        // Activates the tool with the given name
        // Returns false if the tool does not exist
        set = function(name) {
            if (tools[name] != null) {
                if (tools[currentTool].onDeselect != null) {
                    tools[currentTool].onDeselect();
                }
                currentTool = name;
                tools[name].activate();
                if (tools[name].onSelect != null) {
                    tools[name].onSelect();
                }
                return true;
            }
            return false;
        },
        
        // Returns the id of the default tool
        getDefault = function() {
            return defaultTool;
        };
		
		// Brush tool
        tools.brush = new Tool();
        tools.brush.minDistance = settings.get("strokeWidth") * 0.5;
        
        tools.brush.onSelect = function() {
            ui.stage.set_cursor("draw");
        };
        
        tools.brush.onMouseDown = function(event) {
            ui.stage.set_cursor("none");
            this.stroke = new Path.Circle(event.point, settings.get("strokeWidth") * 0.5);
            this.stroke.fillColor = settings.get("color");
            this.firstDrag = true;
        };
        
        tools.brush.onMouseDrag = function(event) {
            var outlineVector, leftPoint, rightPoint;
            
            this.stroke.remove();
            
            outlineVector= event.delta.normalize();
            outlineVector.length *= settings.get("strokeWidth") * 0.5;
            outlineVector.angle += 90;
            
            if (this.firstDrag) {
                this.leftPath = new Path([
					new Point(
						event.lastPoint.x + outlineVector.x,
						event.lastPoint.y + outlineVector.y
					)
				]);
                this.rightPath = new Path([
					new Point(
						event.lastPoint.x - outlineVector.x,
						event.lastPoint.y - outlineVector.y
					)
				]);
                this.firstDrag = false;
            }
            
            leftPoint = new Point(
                event.middlePoint.x + outlineVector.x,
                event.middlePoint.y + outlineVector.y
            );
            rightPoint = new Point(
                event.middlePoint.x - outlineVector.x,
                event.middlePoint.y - outlineVector.y
            );
            this.leftPath.add(leftPoint);
            this.rightPath.add(rightPoint);
            
            this.stroke = this.leftPath.clone();
			this.stroke.reverse();
            this.stroke.arcTo(this.rightPath.firstSegment.point);
            this.stroke.join(this.rightPath.clone());
            this.stroke.arcTo(this.stroke.firstSegment.point);
            this.stroke.fillColor = settings.get("color");
        };
        
        tools.brush.onMouseUp = function(event) {
            ui.stage.set_cursor("draw");
            this.stroke.remove();
            
            if (!this.firstDrag) {
				this.leftPath.reverse();
                this.leftPath.simplify(4);
                this.rightPath.simplify(4);
                this.stroke = this.rightPath.clone();
                this.stroke.arcTo(this.leftPath.firstSegment.point);
                this.stroke.join(this.leftPath.clone());
                this.stroke.arcTo(this.stroke.firstSegment.point);
				this.stroke.closePath();
				this.stroke.reduce();
				this.stroke = this.stroke.unite(this.stroke);
                this.stroke.fillColor = settings.get("color");
            }
            
            add_stroke(this.stroke);
            controller.draw();
        };
        
        // Circle tool
        tools.circle = new Tool();
        
        tools.circle.onSelect = function() {
            ui.stage.set_cursor("draw");
        };
        
        tools.circle.onMouseDrag = function(event) {
            var d, c, r;
            
            if (this.stroke != null) {
                this.stroke.remove();
            }
            
            d = new Point(
                event.point.x - event.downPoint.x,
                event.point.y - event.downPoint.y
            );
            c = new Point(
                event.downPoint.x + (d.x * 0.5),
                event.downPoint.y + (d.y * 0.5)
            );
            r = d.length * 0.5;
            
            this.stroke = new CompoundPath({
                children: [
                    new Path.Circle(c, r + (settings.get("strokeWidth") * 0.5)),
                    new Path.Circle(c, r - (settings.get("strokeWidth") * 0.5))
                ],
                fillColor: settings.get("color")
            });
        };
        
        tools.circle.onMouseUp = function(event) {
            add_stroke(this.stroke);
            this.stroke = null;
            controller.draw();
        };
		
		// Eraser tool
        tools.eraser = new Tool();
        tools.eraser.minDistance = settings.get("strokeWidth") * 0.5;
        
        tools.eraser.onSelect = function() {
            ui.stage.set_cursor("draw");
        };
        
        tools.eraser.onMouseDown = function(event) {
            this.stroke = new Path.Circle(event.point, settings.get("strokeWidth") * 0.5);
            this.stroke.fillColor = new Color(0);
			this.stroke.blendMode = "destination-out";
            this.firstDrag = true;
        };
        
        tools.eraser.onMouseDrag = function(event) {
            var outlineVector, leftPoint, rightPoint;
            
            this.stroke.remove();
            
            outlineVector= event.delta.normalize();
            outlineVector.length *= settings.get("strokeWidth") * 0.5;
            outlineVector.angle += 90;
            
            if (this.firstDrag) {
                this.leftPath = new Path([
					new Point(
						event.lastPoint.x + outlineVector.x,
						event.lastPoint.y + outlineVector.y
					)
				]);
                this.rightPath = new Path([
					new Point(
						event.lastPoint.x - outlineVector.x,
						event.lastPoint.y - outlineVector.y
					)
				]);
                this.firstDrag = false;
            }
            
            leftPoint = new Point(
                event.middlePoint.x + outlineVector.x,
                event.middlePoint.y + outlineVector.y
            );
            rightPoint = new Point(
                event.middlePoint.x - outlineVector.x,
                event.middlePoint.y - outlineVector.y
            );
            this.leftPath.add(leftPoint);
            this.rightPath.add(rightPoint);
            
            this.stroke = this.leftPath.clone();
			this.stroke.reverse();
            this.stroke.arcTo(this.rightPath.firstSegment.point);
            this.stroke.join(this.rightPath.clone());
            this.stroke.arcTo(this.stroke.firstSegment.point);
            this.stroke.fillColor = new Color(0);
			this.stroke.blendMode = "destination-out";
        };
        
        tools.eraser.onMouseUp = function(event) {
            this.stroke.remove();
            
            if (!this.firstDrag) {
				this.leftPath.reverse();
                this.leftPath.simplify(4);
                this.rightPath.simplify(4);
                this.stroke = this.rightPath.clone();
                this.stroke.arcTo(this.leftPath.firstSegment.point);
                this.stroke.join(this.leftPath.clone());
                this.stroke.arcTo(this.stroke.firstSegment.point);
				this.stroke.closePath();
				this.stroke.reduce();
				this.stroke = this.stroke.unite(this.stroke);
				this.stroke.fillColor = new Color(0);
            }
            
            add_stroke(this.stroke, true);
            controller.draw();
        };
        
        // Line tool
        tools.line = new Tool();
        
        tools.line.onSelect = function() {
            ui.stage.set_cursor("draw");
        };
        
        tools.line.onMouseDown = function(event) {
            this.stroke = new Path.Circle(event.point, settings.get("strokeWidth") * 0.5);
            this.stroke.fillColor = settings.get("color");
            this.firstDrag = true;
        };
        
        tools.line.onMouseDrag = function(event) {
            var p1l, p1r, p2l, p2r, outlineVector;
            
            this.stroke.remove();
            
            outlineVector = new Point(
                event.point.x - event.downPoint.x,
                event.point.y - event.downPoint.y
            );
            outlineVector = outlineVector.normalize();
            outlineVector.length *= settings.get("strokeWidth") * 0.5;
            outlineVector.angle += 90;
            
            p1l = new Point(
                event.downPoint.x + outlineVector.x,
                event.downPoint.y + outlineVector.y
            );
            p1r = new Point(
                event.downPoint.x - outlineVector.x,
                event.downPoint.y - outlineVector.y
            );
            p2l = new Point(
                event.point.x + outlineVector.x,
                event.point.y + outlineVector.y
            );
            p2r = new Point(
                event.point.x - outlineVector.x,
                event.point.y - outlineVector.y
            );
            
            
            this.stroke = new Path(p1l);
            this.stroke.arcTo(p1r);
            this.stroke.lineTo(p2r);
            this.stroke.arcTo(p2l);
            this.stroke.closePath();
			this.stroke.reduce();
            this.stroke.fillColor = settings.get("color");
        };
        
        tools.line.onMouseUp = function(event) {
            this.stroke.remove();
            
            if (!this.firstDrag) {
                this.stroke = this.rightPath.clone();
                this.stroke.arcTo(this.leftPath.firstSegment.point);
                this.stroke.join(this.leftPath.clone());
                this.stroke.arcTo(this.stroke.firstSegment.point);
                this.stroke.fillColor = settings.get("color");
            }
            
            add_stroke(this.stroke);
            controller.draw();
        };
        
        // Manipulate tool
        tools.manipulate = new Tool();
		
        tools.manipulate.onSelect = function() {
            ui.stage.set_cursor("cursor");
        };
        
        tools.manipulate.onMouseDown = function(e) {
            var hitResult;
            
			// If a path within the current target group is hit, select it
			// Deselect it if it is already selected
			hitResult = targetGroup.hitTest(e.point);
			if (hitResult != null) {
				hitResult.item.selected = true;
				this.mode = "drag";
			} else {
				this.onDeselect();
				this.mode = "deselect";
			}
        };
        
        tools.manipulate.onMouseDrag = function(e) {
			var i;
			
			switch (this.mode) {
				case "drag":
					for (i = 0; i < project.selectedItems.length; i += 1) {
						project.selectedItems[i].position = new Point(
							project.selectedItems[i].position.x + e.delta.x,
							project.selectedItems[i].position.y + e.delta.y
						);
					}
					break;
				default: // deselect -> box
					if (this.mode === "deselect") this.mode = "box";
					if (this.selectBox != null) this.selectBox.remove();
                    this.selectBox = new Path.Rectangle({
						point: [
							e.downPoint.x,
							e.downPoint.y
						],
						size: [
							e.point.x - e.downPoint.x,
							e.point.y - e.downPoint.y
						],
						strokeColor: "#FF3333"
					});
					break;
			}
        };
        
        tools.manipulate.onMouseUp = function(e) {
            var i, path;
			
			// If a box selection was made, select all items within the select box
            if (this.mode === "box") {
				if (this.selectBox != null) this.selectBox.remove();
				for (i = 0; i < targetGroup.children.length; i += 1) {
					path = targetGroup.children[i];
					if (this.selectBox.contains(path.bounds)) {
						path.selected = true;
					}
				}
            }
        };
        
        tools.manipulate.onDeselect = function() {
			var i, paths = project.selectedItems;
			project.deselectAll();
			for (i = 0; i < paths.length; i += 1) {
				paths[i].remove();
				add_stroke(paths[i]);
			}
			view.draw();
        };
        
        // Pan tool
        tools.pan = new Tool();
        
        tools.pan.onSelect = function() {
			var canvas = document.getElementById("canvas");
			
			tools.pan.mouse_down_handler = function(e) {
				var cRect = canvas.getBoundingClientRect(),
					oldView = view.center.clone(),
					downPoint = new Point(
						e.clientX - cRect.left,
						e.clientY - cRect.top
					),
				
				mouse_move_handler = function(e) {
					var d = new Point(
						e.clientX - cRect.left - downPoint.x,
						e.clientY - cRect.top - downPoint.y
					);
					view.center = new Point(
						oldView.x - (d.x / view.zoom),
						oldView.y - (d.y / view.zoom)
					);
				},
				
				mouse_up_handler = function() {
					ui.stage.set_cursor("grab");
					window.removeEventListener("mousemove", mouse_move_handler);
					window.removeEventListener("mouseup", mouse_up_handler);
				};
				
				ui.stage.set_cursor("grabbing");
				window.addEventListener("mousemove", mouse_move_handler);
				window.addEventListener("mouseup", mouse_up_handler);
			}
			canvas.addEventListener("mousedown", tools.pan.mouse_down_handler);
            ui.stage.set_cursor("grab");
        };
			
		tools.pan.onDeselect = function() {
			canvas.removeEventListener("mousedown", tools.pan.mouse_down_handler);
		};
        
        // Square tool
        tools.square = new Tool();
        
        tools.square.onSelect = function() {
            ui.stage.set_cursor("draw");
        };
        
        tools.square.onMouseDrag = function(e) {
            var d, c, sw;
            sw = settings.get("strokeWidth");
            
            if (this.stroke != null) {
                this.stroke.remove();
            }
            
            d = new Point(
                e.point.x - e.downPoint.x,
                e.point.y - e.downPoint.y
            );
            
            this.stroke = new CompoundPath({
                children: [
                    new Path.Rectangle(
                        new Point(0, 0),
                        new Size(
                            Math.abs(d.x) + sw,
                            Math.abs(d.y) + sw
                        )
                    ),
                    new Path.Rectangle(
                        new Point(0, 0),
                        new Size(
                            Math.abs(d.x) - sw,
                            Math.abs(d.y) - sw
                        )
                    )
                ],
                fillColor: settings.get("color"),
            });
            this.stroke.children[0].position =
            this.stroke.children[1].position =
            new Point(
                e.downPoint.x + (d.x * 0.5),
                e.downPoint.y + (d.y * 0.5)
            );
        };
        
        tools.square.onMouseUp = function(event) {
            add_stroke(this.stroke);
            this.stroke = null;
            controller.draw();
        };
        
        o.getDefault = getDefault;
        o.set        = set;
        return o;
    }());

    o.delete_group      = delete_group;
    o.delete_layer      = delete_layer;
	o.from_JSON         = from_JSON;
	o.get_frame_extents = get_frame_extents;
    o.get_frame_num     = get_frame_num;
    o.get_group_frame   = get_group_frame;
    o.get_layer_name    = get_layer_name;
    o.get_layer_num     = get_layer_num;
    o.get_target_frame  = get_target_frame;
    o.get_target_layer  = get_target_layer;
    o.hide_layer        = hide_layer;
    o.is_layer_visible  = is_layer_visible;
    o.new_group         = new_group;
    o.new_layer         = new_layer;
    o.redo              = redo;
    o.rename_layer      = rename_layer;
    o.set_frames        = set_frames;
    o.target_cell       = target_cell;
	o.to_JSON           = to_JSON;
    o.undo              = undo;
    o.unhide_layer      = unhide_layer;
    
    o.settings = settings;
    o.tools    = tools;
    
    return o;
}());