"use strict";

var

controller = (function(){
    var o = {},
    
    // Private variables
    playing = false,
    tickTimer,
    
    // Public functions
	
	// Removes everything from a keycell
	clear_keycell = function() {
        var l = data.get_target_layer(),
            n = data.get_layer_name(l),
            f = data.get_target_frame(),
        callback = function() {
            if (data.delete_group(l, f)) {
                ui.timeline
                    .get_layer(l)
                    .get_cell(f)
                    .set_empty_key();
                ui.stage
                    .update();
            }
        };
        ui.prompt({
            message:      "Clear keyframe " + f + " on layer '" + n + "'?",
            button1: {
                name:     "Clear",
                callback: callback
            },
            button2: {
                name:     "Cancel"
            }
        });
	},
    
    // Removes the current keycell
    delete_keycell = function() {
        var l = data.get_target_layer(),
            n = data.get_layer_name(l),
            f = data.get_target_frame(),
        callback = function() {
            if (data.delete_group(l, f)) {
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
				ui.timeline.scrollbars
					.update_vertical();
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
	
	// Loads an animation with a given id
	load = function(id) {
		var response, requestString = "?id=" + id,
			request = new XMLHttpRequest();
			
		request.open("GET", "/actions/load_animation.php" + requestString, false);

		request.onreadystatechange = function() {
			if (this.readyState === 4) {
				if (this.status >= 200 && this.status < 400) {
					response = JSON.parse(this.responseText);
					if (response.success) {
						data.from_JSON(JSON.stringify(response.data));
						data.settings.set("saveID", id);
						zoom_stage();
					} else {
						ui.prompt({
							message:      response.error,
							button1: {
								name:     "Okay"
							},
						});
					}
				} else {
					ui.prompt({
						message:      "Sorry, the animation failed to load.",
						button1: {
							name:     "Okay"
						},
					});
				}
			}
		};

		request.onerror = function() {
			ui.prompt({
				message:      "Sorry, there was an error connecting to the server. Check your internet connection and try again.",
				button1: {
					name:     "Okay"
				},
			});
		};

		request.send();
	},
    
    // Creates a new keycell at the current frame
    new_keycell = function() {
        var l = data.get_target_layer(),
            f = data.get_target_frame();
        if (data.new_group(l, f)) {
            ui.timeline
                .get_layer(l)
                .get_cell(f)
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
				ui.timeline.scrollbars
					.update_vertical();
                ui.timeline
                    .get_layer(layerIndex)
                    .select();
                ui.timeline
                    .get_layer(layerIndex)
                    .get_cell(f)
                    .select();
				window.setTimeout(function(){
					zoom_stage();
				}, 10);
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
	
	// Reloads the editor, creating an empty animation
	new_animation = function() {
		var callback = function() {
			data.from_JSON(blankProject);
		}
        ui.prompt({
            message:      "Create a new animation? All unsaved work will be lost!",
            button1: {
                name:     "Create",
                callback: callback
            },
            button2: {
                name:     "Cancel"
            }
        });
	},
    
    // Pauses the animation if playing
    pause = function() {
        if (playing) {
            playing = false;
			document.getElementById("pause").classList.add("selected");
			document.getElementById("play").classList.remove("selected");
			document.getElementById("toolbarOverlay").classList.add("hidden");
			document.getElementById("timelineOverlay").classList.add("hidden");
            window.clearInterval(tickTimer);
        }
    },
    
    // Plays the animation if paused
    play = function() {
        if (!playing) {
            playing = true;
			document.getElementById("play").classList.add("selected");
			document.getElementById("pause").classList.remove("selected");
			document.getElementById("toolbarOverlay").classList.remove("hidden");
			document.getElementById("timelineOverlay").classList.remove("hidden");
			data.tools.set("playing");
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
	
	// Publishes the current animation
	publish = function() {
		var request, requestString, response,
			published = data.settings.get("published"),
			saveID = data.settings.get("saveID"),
		
		callback = function() {
			requestString = "?id=" + saveID + "&published=" + (published === "true" ? "false" : "true");
			
			request = new XMLHttpRequest();
			request.open("GET", "/actions/publish_animation.php" + requestString, false);

			request.onreadystatechange = function() {
				if (this.readyState === 4) {
					if (this.status >= 200 && this.status < 400) {
						response = JSON.parse(this.responseText);
						if (response.success) {
							data.settings.set("published", (published === "true" ? "false" : "true"));
							ui.prompt({
								message:      "Your animation was " + (published === "true" ? "un-published" : "published") + ".",
								button1: {
									name:     "Okay"
								},
							});
						} else {
							ui.prompt({
								message:      response.error,
								button1: {
									name:     "Okay"
								},
							});
						}
					} else {
						ui.prompt({
							message:      "Sorry, there was a server error. Try saving again.",
							button1: {
								name:     "Okay"
							},
						});
					}
				}
			};

			request.onerror = function() {
				ui.prompt({
					message:      "Sorry, there was an error connecting to the server. Check your internet connection and try again.",
					button1: {
						name:     "Okay"
					},
				});
			};
			
			request.send();
		};
		
		if (data.settings.get("saveID") === "false") {
			ui.prompt({
				message:  "You need to save your animation before you can publish it!",
				button1: {
					name: "Okay"
				}
			});
		} else {
			ui.prompt({
				message:  (published === "true" ? "Un-publish" : "Publish") + " this animation?<br>You can always " + (published === "true" ? "re-publish" : "un-publish") + " it later.",
				button1: {
					name: "Okay",
					callback: callback
				},
				button2: {
					name: "Cancel"
				}
			});
		}
	},
    
    // Redoes the previously undone action
    redo = function() {
		pause();
        if (data.redo()) {
			ui.stage.update();
		} else {
			ui.prompt({
				message:  "There is nothing to redo",
				button1: {
					name: "Okay"
				}
			});
		}
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
	
	// Saves the current animation
	save = function() {
        var animData, requestString, request, response,
			saveID = data.settings.get("saveID"),
		
        callback = function(input) {
			input = input || data.settings.get("title");
            if (input.length > 1024) {
                ui.prompt({
                    message:  "Animation name too long.<br/>Enter a name 1024 or less characters in length.",
                    button1: {
                        name: "Okay",
                        callback: function() {
                            save();
                        }
                    }
                });
            } else {
                data.settings.set("title", input);
				
				animData = data.to_JSON();
				
				requestString = "id=" + saveID + "&data=" + animData + "&title=" + input;
				
				request = new XMLHttpRequest();
					
				request.open('POST', '/actions/save_animation.php', false);
				
				request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				request.setRequestHeader("Content-length", requestString.length);
				request.setRequestHeader("Connection", "close");

				request.onreadystatechange = function() {
					if (this.readyState === 4){
						if (this.status >= 200 && this.status < 400){
							response = JSON.parse(this.responseText);
							if (response.success) {
								ui.prompt({
									message:      "Your animation was saved!",
									button1: {
										name:     "Okay"
									},
								});
								data.settings.set("saveID", response.id);
							} else {
								ui.prompt({
									message:      response.error,
									button1: {
										name:     "Okay"
									},
								});
							}
						} else {
							ui.prompt({
								message:      "Sorry, there was a server error. Try saving again.",
								button1: {
									name:     "Okay"
								},
							});
						}
					}
				};

				request.onerror = function() {
					ui.prompt({
						message:      "Sorry, there was an error connecting to the server. Check your internet connection and try again.",
						button1: {
							name:     "Okay"
						},
					});
				};

				request.send(requestString);
            }
        };
        ui.prompt({
            message:      "Save animation",
            input:        (saveID === "false" ? true : false),
            placeholder:  data.settings.get("title"),
            button1: {
                name:     "Save",
                callback: callback
            },
            button2: {
                name:     "Cancel"
            }
        });
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
							ui.timeline.scrollbars
								.update_horizontal();
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
							ui.timeline.scrollbars
								.update_horizontal();
                        }
                    },
                    button2: {
                        name: "Cancel"
                    }
                });
            } else {
                data.set_frames(frames);
                ui.timeline.set_frames(frames);
				ui.timeline.scrollbars
					.update_horizontal();
            }
        };
        ui.prompt({
            message:      "Enter number of frames:",
            input:        true,
            placeholder:  data.settings.get("frames"),
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
	
	// Shows the load animation dialog
	show_load_dialog = function() {
		var response, requestString = "?user=true&private=true&limit=0",
			request = new XMLHttpRequest();
			
		request.open("GET", "/actions/get_animation_list.php" + requestString, false);

		request.onreadystatechange = function() {
			if (this.readyState === 4) {
				if (this.status >= 200 && this.status < 400) {
					response = JSON.parse(this.responseText);
					if (response.success) {
						ui.load_dialog(response.list);
					} else {
						ui.prompt({
							message:      response.error,
							button1: {
								name:     "Okay"
							},
						});
					}
				} else {
					ui.prompt({
						message:      "Sorry, the server failed to retreive your animations. Try again.",
						button1: {
							name:     "Okay"
						},
					});
				}
			}
		};

		request.onerror = function() {
			ui.prompt({
				message:      "Sorry, there was an error connecting to the server. Check your internet connection and try again.",
				button1: {
					name:     "Okay"
				},
			});
		};

		request.send();
	},
	
	// Shows the settings dialog
	show_settings_dialog = function() {
		ui.settings_dialog({
			title: data.settings.get("title"),
			frameRate: data.settings.get("frameRate"),
			stageHeight: data.settings.get("stageHeight"),
			stageWidth: data.settings.get("stageWidth")
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
	
	toggle_onion_skin = function() {
		data.toggle_onion_skin();
		document.getElementById("onionSkin").classList.toggle("selected");
	},
    
    // Undoes the previous action
    undo = function() {
		pause();
        if (data.undo()) {
			ui.stage.update();
		} else {
			ui.prompt({
				message:  "There is nothing to undo",
				button1: {
					name: "Okay"
				}
			});
		}
    },
	
	// Zooms the stage by a factor of 1, everything shown actual size
	zoom_actual = function() {
		var sw = data.settings.get("stageWidth"),
			sh = data.settings.get("stageHeight");
			
		ui.stage.center(sw * 0.5, sh * 0.5);
		ui.stage.zoom(1);
	},
	
	// Zooms out to show everything at once
	zoom_extents = function() {
		var zp = data.settings.get("zoomPadding") * 2,
			extents = data.get_frame_extents(),
			vw = view.viewSize.width - zp,
			vh = view.viewSize.height - zp;
			
		ui.stage.center(extents.center.x, extents.center.y);
		
		// If the extents are wider than the view
		if (extents.width / extents.height > vw / vh) {
			ui.stage.zoom(vw / extents.width);
		} else {
			ui.stage.zoom(vh / extents.height);
		}
	},
	
	// Zooms in to show the current selection as large as possible
	/*
	zoom_selection = function() {
	},*/
	
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
    
    o.delete_keycell       = delete_keycell;
    o.delete_layer         = delete_layer;
    o.draw                 = draw;
	o.load                 = load;
    o.new_keycell          = new_keycell;
    o.new_layer            = new_layer;
	o.new_animation        = new_animation;
    o.pause                = pause;
	o.publish              = publish;
    o.play                 = play;
    o.redo                 = redo;
    o.rename_layer         = rename_layer;
	o.save                 = save;
    o.select_cell          = select_cell;
    o.select_frame         = select_frame;
    o.select_layer         = select_layer;
    o.set_frames           = set_frames;
    o.set_tool             = set_tool;
	o.show_load_dialog     = show_load_dialog;
	o.show_settings_dialog = show_settings_dialog;
    o.toggle_fullscreen    = toggle_fullscreen;
    o.toggle_layer         = toggle_layer;
	o.toggle_onion_skin    = toggle_onion_skin;
    o.undo                 = undo;
	o.zoom_actual          = zoom_actual;
	o.zoom_extents         = zoom_extents;
	//o.zoom_selection       = zoom_selection;
	o.zoom_stage           = zoom_stage;
    
    return o;
}());