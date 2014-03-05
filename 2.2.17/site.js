//=========================//
//  Clanimate v2.2.15      //
//  Alfie Woodland         //
//  21/02/13               //
//=========================//

(function() {
"use strict";

paper.install(window);

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
        if (cells[layerIndex] == null) {
            return false;
        }
        for (i = 0; i < visibleGroups.length; i += 1) {
            visibleGroups[i].visible = false;
        }
        visibleGroups = [];
        for (i = 1; i < cells.length; i += 1) {
            if (cells[i] != null) {
                for (j = frameIndex; j > 0; j -= 1) {
                    g = cells[i][j];
                    if (g != null) {
                        g.visible = true;
                        visibleGroups.push(g);
                        if (i === layerIndex) {
                            targetGroup = g;
                            targetGroupFrame = j;
                        }
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
            strokeWidth: 8
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
            ui.stage.setCursor("draw");
        };
        
        tools.brush.onMouseDown = function(event) {
            ui.stage.setCursor("none");
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
            ui.stage.setCursor("draw");
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
            ui.stage.setCursor("draw");
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
            ui.stage.setCursor("draw");
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
            ui.stage.setCursor("cursor");
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
            ui.stage.setCursor("grab");
        };
        
        tools.pan.onMouseDown = function(event) {
            ui.stage.setCursor("grabbing");
            this.vPoint = view.center.clone();
            this.ePoint = new Point(
                window.event.clientX,
                window.event.clientY
            );
        };
        
        tools.pan.onMouseDrag = function(event) {
            view.center = new Point(
                this.vPoint.x - (window.event.clientX - this.ePoint.x),
                this.vPoint.y - (window.event.clientY - this.ePoint.y)
            );
        };
        
        tools.pan.onMouseUp = function() {
            ui.stage.setCursor("grab");
        };
        
        // Square tool
        tools.square = new Tool();
        
        tools.square.onSelect = function() {
            ui.stage.setCursor("draw");
        };
        
        tools.square.onMouseDrag = function(event) {
            var d, c, sw;
            sw = settings.get("strokeWidth");
            
            if (this.stroke != null) {
                this.stroke.remove();
            }
            
            d = new Point(
                event.point.x - event.downPoint.x,
                event.point.y - event.downPoint.y
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
                event.downPoint.x + (d.x * 0.5),
                event.downPoint.y + (d.y * 0.5)
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

    o.delete_group     = delete_group;
    o.delete_layer     = delete_layer;
    o.get_frame_num    = get_frame_num;
    o.get_group_frame  = get_group_frame;
    o.get_layer_name   = get_layer_name;
    o.get_layer_num    = get_layer_num;
    o.get_target_frame = get_target_frame;
    o.get_target_layer = get_target_layer;
    o.hide_layer       = hide_layer;
    o.is_layer_visible = is_layer_visible;
    o.new_group        = new_group;
    o.new_layer        = new_layer;
    o.redo             = redo;
    o.rename_layer     = rename_layer;
    o.set_frames       = set_frames;
    o.target_cell      = target_cell;
    o.undo             = undo;
    o.unhide_layer     = unhide_layer;
    
    o.settings = settings;
    o.tools    = tools;
    
    return o;
}()),

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
        
        // Sets the mouse cursor visible on the stage
        setCursor = function(style) {
            cc.classList.remove("cursor", "draw", "grab", "grabbing", "none", "pointer");
            cc.classList.add(style);
        },
        
        // Clears, resizes and redraws the stage
        update = function() {
            var cw = parseFloat(getComputedStyle(cc).width),
                ch = parseFloat(getComputedStyle(cc).height),
                sw = data.settings.get("stageWidth"),
                sh = data.settings.get("stageHeight");
                
            c.setAttribute("width",  cw);
            c.setAttribute("height", ch);
            
            view.viewSize = new Size(cw, ch);
            view.draw();
        };
        
        o.setCursor = setCursor;
        o.update    = update;
        
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
                tooltip.set(name, nameString);
            },
            
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

    toolOptions = (function(){
        var o = {},
        
        // Private variables
        
        toolOptionsElement = document.getElementById("drawingToolOptionsDialog"),
        toolOptionsButton = document.getElementById("drawingToolOptionsButton"),
        overlay = document.getElementById("overlay"),
        
        // Public functions
        
        toggle = function() {
            toolOptionsElement.classList.toggle("hidden");
            overlay.classList.toggle("hidden");
            if(overlay.classList.contains("hidden")) {
                overlay.removeEventListener("mouseup", toggle);
            } else {
                overlay.addEventListener("mouseup", toggle);
            }
        };
        
        // Setup
        
        toolOptionsButton.children[0].style.width =
        toolOptionsButton.children[0].style.height =
        data.settings.get("strokeWidth") + "px";
        
        toolOptionsButton.addEventListener("mouseup", toggle);
        tooltip.set({
            element: toolOptionsButton,
            message: "Drawing tool options",
            position: "right"
        });
        toolOptionsElement.addEventListener("mouseup", function(e) {
            e.stopPropagation();
        });
        
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
}()),

controller = (function(){
    var o = {},
    
    // Private variables
    playing = false,
    tickTimer,
    
    // Public functions
    
    // Removes the current keycell
    delete_keycell = function() {
        var l = data.get_target_layer(),
            n = data.get_layer_name(l),
            f = data.get_target_frame(),
        callback = function() {
            if (data.delete_group()) {
                ui.timeline
                    .get_layer(l)
                    .get_cell(f)
                    .set_empty();
                ui.stage
                    .update();
            }
        };
        ui.prompt({
            message:      "Delete keyframe " + f + " on layer '" + n + "'?",
            button1: {
                name:     "Delete",
                callback: callback
            },
            button2: {
                name:     "Cancel"
            }
        });
    },
    
    // Removes the layer with the given index
    delete_layer = function(layerIndex) {
        var name = data.get_layer_name(layerIndex),
        callback = function(input) {
            if (data.delete_layer(layerIndex)) {
                ui.timeline
                    .get_layer(layerIndex)
                    .remove();
                ui.stage
                    .update();
            }
        };
        if (data.get_layer_num() > 1) {
            ui.prompt({
                message:      "Delete layer '" + name + "'?",
                button1: {
                    name:     "Delete",
                    callback: callback
                },
                button2: {
                    name:     "Cancel"
                }
            });
        } else {
            ui.prompt({
                message:      "There must be at least 1 layer on the timeline.<br/>Cannot delete this layer.",
                button1: {
                    name:     "Okay"
                }
            });
        }
    },
    
    // Updates the ui when the user draws to the stage
    draw = function() {
        var drawFrame, index;
        drawFrame = data.get_group_frame();
        index     = data.get_target_layer();
        ui.timeline
            .get_layer(index)
            .get_cell(drawFrame)
            .set_key();
    },
    
    // Loads a project with a given id
    load = function(id) {
        
    },
    
    // Creates a new keycell at the current cell
    new_keycell = function() {
        var l, c;
        if (data.new_group()) {
            l = data.get_target_layer();
            c = data.get_target_frame();
            ui.timeline
                .get_layer(l)
                .get_cell(c)
                .set_empty_key();
            ui.stage.update();
        }
    },
    
    // Creates a new layer with a given name
    new_layer = function() {
        var layerIndex, frames,
        callback = function(input) {
            if (input.length < 32) {
            var f = data.get_target_frame();
                data.rename_layer(layerIndex, input);
                ui.timeline.new_layer(layerIndex, input);
                ui.timeline
                    .get_layer(layerIndex)
                    .get_cell(f)
                    .select();
            } else {
                data.delete_layer(layerIndex);
                ui.prompt({
                    message:  "Layer name too long.<br/>Enter a name less than 32 characters in length.",
                    button1: {
                        name: "Okay",
                        callback: function() {
                            new_layer();
                        }
                    }
                });
            }
        };
        layerIndex = data.new_layer();
        ui.prompt({
            message:      "Enter layer name:",
            input:        true,
            placeholder:  "Layer " + layerIndex,
            button1: {
                name:     "Create",
                callback: callback
            },
            button2: {
                name:     "Cancel",
                callback: function() {
                    data.delete_layer(layerIndex);
                }
            }
        });
    },
    
    // Pauses the animation if playing
    pause = function() {
        if (playing) {
            playing = false;
            window.clearInterval(tickTimer);
        }
    },
    
    // Plays the animation if paused
    play = function() {
        if (!playing) {
            playing = true;
            tickTimer = window.setInterval(function() {
                var newFrame = data.get_target_frame() + 1;
                if (newFrame > data.get_frame_num()) {
                    select_frame(1);
                } else {
                    select_frame(newFrame);
                }
            }, 1000 / data.settings.get("frameRate"));
        }
    },
    
    // Redoes the previously undone action
    redo = function() {
        data.redo();
    },
    
    // Renames the layer at the given index
    rename_layer = function(layerIndex) {
        var
        callback = function(input) {
            if (input.length < 32) {
                data.rename_layer(layerIndex, input);
                ui.timeline
                    .get_layer(layerIndex)
                    .rename(input);
            } else {
                ui.prompt({
                    message:  "Layer name too long.<br/>Enter a name less than 32 characters in length.",
                    button1: {
                        name: "Okay",
                        callback: function() {
                            rename_layer(layerIndex);
                        }
                    }
                });
            }
        };
        ui.prompt({
            message:      "Enter new layer name:",
            input:        true,
            placeholder:  data.get_layer_name(layerIndex),
            button1: {
                name:     "Rename",
                callback: callback
            },
            button2: {
                name:     "Cancel"
            }
        });
    },
    
    // Saves the current project
    save = function() {
        
    },
    
    // Selects the the cell at the given layer and frame
    select_cell = function(layerIndex, frameIndex) {
        if(data.target_cell(layerIndex, frameIndex)) {
            var layer, cell;
            layer = ui.timeline.get_layer(layerIndex);
            cell = layer.get_cell(frameIndex);
            layer.select();
            cell.select();
        }
        ui.stage.update();
    },
    
    // Selects the frame at the given index
    select_frame = function(frameIndex) {
        var layerIndex = data.get_target_layer();
        select_cell(layerIndex, frameIndex);
    },  
    
    // Selects the layer at the given index
    select_layer = function(layer) {
        var frame = data.get_target_frame();
        select_cell(layer, frame);
    },    
    
    // Sets the number of animation frames
    set_frames = function() {
        var
        callback = function(input) {
            var frames = parseInt(input, 10);
            if (isNaN(frames)) {
                ui.prompt({
                    message:  "Please enter an integer between 1 and 5000.",
                    button1: {
                        name: "Okay",
                        callback: function() {
                            set_frames();
                        }
                    }
                });
            } else if (frames < 1) {
                ui.prompt({
                    message:  "There must be at least 1 frame on the timeline.<br/>Set frames to 1?",
                    button1: {
                        name: "Set",
                        callback: function() {
                            data.set_frames(1);
                            ui.timeline.set_frames(1);
                        }
                    },
                    button2: {
                        name: "Cancel"
                    }
                });
            } else if (frames > 5000) {
                ui.prompt({
                    message:  "There can be a maximum of 5000 frames on the timeline.<br/>Set frames to 5000?",
                    button1: {
                        name: "Set",
                        callback: function() {
                            data.set_frames(5000);
                            ui.timeline.set_frames(5000);
                        }
                    },
                    button2: {
                        name: "Cancel"
                    }
                });
            } else {
                data.set_frames(frames);
                ui.timeline.set_frames(frames);
            }
        };
        ui.prompt({
            message:      "Enter number of frames:",
            input:        true,
            placeholder:  data.get_frame_num(),
            button1: {
                name:     "Set",
                callback: callback
            },
            button2: {
                name:     "Cancel"
            }
        });
    },
    
    // Sets the current drawing tool
    set_tool = function(toolId) {
        var toolButtons = document.getElementsByClassName("tool");
        Array.prototype.forEach.call(toolButtons, function(el){
            if (el.getAttribute("id") === toolId) {
                el.classList.add("selected");
                data.tools.set(toolId);
            } else {
                el.classList.remove("selected");
            }
        });
    },
    
    // Pauses the animation and returns to the first frame if playing
    stop = function() {
        pause();
        select_frame(1);
    },
    
    // Toggles fullscreen mode
    toggle_fullscreen = function() {
        var doc = document.documentElement;
        if (!document.fullscreenElement &&
            !document.mozFullScreenElement &&
            !document.webkitFullscreenElement &&
            !document.msFullscreenElement ) {
            if (doc.requestFullscreen) {
                doc.requestFullscreen();
            } else if (doc.msRequestFullscreen) {
                doc.msRequestFullscreen();
            } else if (doc.mozRequestFullScreen) {
                doc.mozRequestFullScreen();
            } else if (doc.webkitRequestFullscreen) {
                doc.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    },
    
    // Hides or unhides the layer with the given index
    toggle_layer = function(layer) {
        var visible = data.is_layer_visible(layer);
        if (visible && data.hide_layer(layer)) {
            ui.timeline
                .get_layer(layer)
                .hide();
            ui.stage
                .update();
        } else if (data.unhide_layer(layer)) {
            ui.timeline
                .get_layer(layer)
                .unhide();
            ui.stage
                .update();
        }
    },
    
    // Undoes the previous action
    undo = function() {
        data.undo();
    };
    
    o.delete_keycell      = delete_keycell;
    o.delete_layer        = delete_layer;
    o.draw                = draw;
    o.new_keycell         = new_keycell;
    o.new_layer           = new_layer;
    o.pause               = pause;
    o.play                = play;
    o.redo                = redo;
    o.rename_layer        = rename_layer;
    o.select_cell         = select_cell;
    o.select_frame        = select_frame;
    o.select_layer        = select_layer;
    o.set_frames          = set_frames;
    o.set_tool            = set_tool;
    o.toggle_fullscreen   = toggle_fullscreen;
    o.toggle_layer        = toggle_layer;
    o.undo                = undo;
    
    return o;
}());

//========= Setup =========//
window.onload = function() {
    var sw, sh, bg,
        layerIndex, layerName, frameIndex,
        i, initFrames = 20,
        toolButtons, toolOptionsButton, toolOptions,
        fullscreen,
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
    
    // Events
    
    // Tool buttons
    toolButtons = document.getElementsByClassName("tool");
    Array.prototype.forEach.call(toolButtons, function(el){
        ui.tooltip.set({
            element: el,
            message: el.getAttribute("id"),
            position: "right"
        });
        el.addEventListener("mouseup", function(e) {
            e.stopPropagation();
            controller.set_tool(el.getAttribute("id"));
        });
    });
    
    // fullscreen handler
    fullscreen = document.getElementById("fullscreenButton");
    fullscreen.addEventListener("mouseup", function(e) {
        e.stopPropagation();
        controller.toggle_fullscreen();
    });
    
    // play / pause / stop handlers
    play = document.getElementById("play");
    play.addEventListener("mouseup", function(e) {
        e.stopPropagation();
        controller.play();
    });
    pause = document.getElementById("pause");
    pause.addEventListener("mouseup", function(e) {
        e.stopPropagation();
        controller.pause();
    });
    
    // addLayer handler
    addLayer = document.getElementById("addLayer");
    addLayer.addEventListener("mouseup", function(e) {
        e.stopPropagation();
        controller.new_layer();
    });
    
    // addFrame handler
    setFrames = document.getElementById("setFrames");
    setFrames.addEventListener("mouseup", function(e) {
        e.stopPropagation();
        controller.set_frames();
    });
    
    // Window resize handler
    window.addEventListener("resize", function(e) {
        ui.stage.update();
    });
    
    // Tooltips
    ui.tooltip.set({
        element: fullscreen,
        message: "Toggle fullscreen mode",
        position: "below"
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
};

}());
