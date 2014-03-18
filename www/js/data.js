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
    delete_group = function() {
        if (cells[targetLayer][targetFrame] != null) {
            cells[targetLayer][targetFrame].remove();
            cells[targetLayer][targetFrame] = undefined;
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
		var i, b, x1, y1, x2, y2;
		if (visibleGroups.length === 0) return false;
		for (i = 0; i < visibleGroups.length; i++) {
			b = visibleGroups[i].bounds;
			if (x1 === undefined || x1 > b.x)            x1 = b.x;
			if (y1 === undefined || y1 > b.y)            y1 = b.y;
			if (x2 === undefined || x2 < b.x + b.width)  x2 = b.x + b.width;
			if (y2 === undefined || y2 < b.y + b.height) y2 = b.y + b.height;
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
        return l.data.name;
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
    new_group = function() {
        var g, l;
        if (cells[targetLayer][targetFrame] == null) {
            g = new Group();
            l = get_project_layer(targetLayer);
            cells[targetLayer][targetFrame] = g;
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
        cells[layerIndex][1] = new Group();
        target_cell(layerIndex, targetFrame);
        return layerIndex;
    },
    
    // Redoes the previously undone action and returns true
    // Returns false if there is nothing to redo
    redo = function() {
        
    },
    
    // Renames the layer with the given index and returns true
    // Returns false if the layer does not exist
    rename_layer = function(layer, name) {
        var l = get_project_layer(layer);
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
    target_cell = function(layerIndex, frameIndex) {
        var i, j, g;
		
		// Check if the given layer actually exists
        if (cells[layerIndex] == null) {
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
                for (j = frameIndex; j > 0; j -= 1) {
				
					// If there is a group in this cell
                    g = cells[i][j];
                    if (g != null) {
					
						// Set it to visible
                        g.visible = true;
                        visibleGroups.push(g);
						
						// If this is the currently selected layer, set this group as the target group for drawing
                        if (i === layerIndex) {
                            targetGroup = g;
                            targetGroupFrame = j;
                        }
						
						// Go to the next layer
                        break;
                    }
                }
            }
        }
        targetLayer = layerIndex;
        targetFrame = frameIndex;
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
            frameRate:   30,
            stageHeight: 450,
            stageWidth:  800,
            color: "#000000",
            strokeWidth: 8,
			zoomPadding: 4
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
            this.stroke.fillColor = settings.get("strokeColor");
            this.firstDrag = true;
        };
        
        tools.brush.onMouseDrag = function(event) {
            var outlineVector, leftPoint, rightPoint;
            
            this.stroke.remove();
            
            outlineVector= event.delta.normalize();
            outlineVector.length *= settings.get("strokeWidth") * 0.5;
            outlineVector.angle += 90;
            
            if (this.firstDrag) {
                this.leftPath = new Path();
                this.rightPath = new Path();
                this.leftPath.add(new Point(
                    event.lastPoint.x + outlineVector.x,
                    event.lastPoint.y + outlineVector.y
                ));
                this.rightPath.add(new Point(
                    event.lastPoint.x - outlineVector.x,
                    event.lastPoint.y - outlineVector.y
                ));
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
            this.leftPath.insert(0, leftPoint);
            this.rightPath.add(rightPoint);
            
            this.stroke = this.rightPath.clone();
            this.stroke.arcTo(this.leftPath.firstSegment.point);
            this.stroke.join(this.leftPath.clone());
            this.stroke.arcTo(this.stroke.firstSegment.point);
            this.stroke.fillColor = settings.get("strokeColor");
        };
        
        tools.brush.onMouseUp = function(event) {
            ui.stage.set_cursor("draw");
            this.stroke.remove();
            
            if (!this.firstDrag) {
                this.leftPath.simplify(4);
                this.rightPath.simplify(4);
                this.stroke = this.rightPath.clone();
                this.stroke.arcTo(this.leftPath.firstSegment.point);
                this.stroke.join(this.leftPath.clone());
                this.stroke.arcTo(this.stroke.firstSegment.point);
                this.stroke.fillColor = settings.get("strokeColor");
            }
            
            targetGroup.addChild(this.stroke);
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
                fillColor: settings.get("strokeColor")
            });
        };
        
        tools.circle.onMouseUp = function(event) {
            this.stroke.remove();
            targetGroup.addChild(this.stroke.clone());
            controller.draw();
        };
        
        // Line tool
        tools.line = new Tool();
        
        tools.line.onSelect = function() {
            ui.stage.set_cursor("draw");
        };
        
        tools.line.onMouseDown = function(event) {
            this.stroke = new Path.Circle(event.point, settings.get("strokeWidth") * 0.5);
            this.stroke.fillColor = settings.get("strokeColor");
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
            this.stroke.fillColor = settings.get("strokeColor");
        };
        
        tools.line.onMouseUp = function(event) {
            this.stroke.remove();
            
            if (!this.firstDrag) {
                this.stroke = this.rightPath.clone();
                this.stroke.arcTo(this.leftPath.firstSegment.point);
                this.stroke.join(this.leftPath.clone());
                this.stroke.arcTo(this.stroke.firstSegment.point);
                this.stroke.fillColor = settings.get("strokeColor");
            }
            
            targetGroup.addChild(this.stroke);
            controller.draw();
        };
        
        // Manipulate tool
        tools.manipulate = new Tool();
        
        tools.manipulate.onSelect = function() {
            ui.stage.set_cursor("cursor");
        };
        
        tools.manipulate.onMouseDown = function(event) {
            var i, j, hitResult, hit = false;
            this.selectBox = null;
            this.ePoint = new Point(
                window.event.clientX,
                window.event.clientY
            );
            
            for (i = 0; i < visibleGroups.length; i += 1) {
                for (j=0; j < visibleGroups[i].children.length; j += 1) {
                    hitResult = visibleGroups[i].children[j].hitTest(event.point);
                    if (hitResult != null && hit === false) {
                        visibleGroups[i].children[j].strokeColor = "#009DEC";
                        this.selected = visibleGroups[i].children[j];
                        hit = true;
                    } else {
                        visibleGroups[i].children[j].strokeColor = null;
                    }
                }
            }
            
            if (hit) {
                this.pPoint = this.selected.position.clone();
            } else {
                this.selected = null;
            }
        };
        
        tools.manipulate.onMouseDrag = function(event) {
            if (this.selected == null) {
                
                if (this.selectBoxFill != null)   this.selectBoxFill.remove();
                if (this.selectBoxBorder != null) this.selectBoxBorder.remove();
                
                this.selectBox = new Rectangle(
                    new Point(event.downPoint.x, event.downPoint.y),
                    new Point(event.point.x, event.point.y)
                );
                
                this.selectBoxFill = new Shape.Rectangle(this.selectBox);
                this.selectBoxFill.fillColor = "#009DEC";
                this.selectBoxFill.opacity   = 0.2;
                
                this.selectBoxBorder = new Shape.Rectangle(this.selectBox);
                this.selectBoxBorder.strokeColor = "#009DEC";
                this.selectBoxBorder.strokeWidth = 1;
                
            } else {
                this.selected.position = new Point(
                    this.pPoint.x + (window.event.clientX - this.ePoint.x),
                    this.pPoint.y + (window.event.clientY - this.ePoint.y)
                );
            }
        };
        
        tools.manipulate.onMouseUp = function(event) {
            var i, j, s;
            if (this.selectBoxFill != null)   this.selectBoxFill.remove();
            if (this.selectBoxBorder != null) this.selectBoxBorder.remove();
            if (this.selectBox != null) {
                this.selected = [];
                for (i = 0; i < visibleGroups.length; i += 1) {
                    for (j=0; j < visibleGroups[i].children.length; j += 1) {
                        s = visibleGroups[i].children[j];
                        if (this.selectBox.contains(s.bounds)) {
                            s.strokeColor = "#009DEC";
                            this.selected.push(s);
                        }
                    }
                }
            }
        };
        
        tools.manipulate.onDeselect = function() {
            if (this.selected != null) this.selected.strokeColor = null;
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
						oldView.x - d.x,
						oldView.y - d.y
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
                fillColor: settings.get("strokeColor")
            });
            this.stroke.children[0].position =
            this.stroke.children[1].position =
            new Point(
                e.downPoint.x + (d.x * 0.5),
                e.downPoint.y + (d.y * 0.5)
            );
        };
        
        tools.square.onMouseUp = function(event) {
            this.stroke.remove();
            targetGroup.addChild(this.stroke.clone());
            controller.draw();
        };
        
        o.getDefault = getDefault;
        o.set        = set;
        return o;
    }());

    o.delete_group      = delete_group;
    o.delete_layer      = delete_layer;
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
    o.undo              = undo;
    o.unhide_layer      = unhide_layer;
    
    o.settings = settings;
    o.tools    = tools;
    
    return o;
}());