var AbstractVisualization = Fiber.extend(function() {
    return {
        init: function(container, history) {
            this.container = container;
            this.history = history;

            this.renderer = null;
            this.scene = null;
            this.camera = null;
            this.controls = null;
            this.stats = null;

            this.gui = null;
            this.guiIteration = null;

            this.iteration = 0;
            this.lastIteration = this.iteration;

            this.timer = null;
            this.playing = false;

            this.speed = 500;
            this.maxSpeed = 1000;

            this.reshape = true;

            this.snapshot = null;
            this.loadTimeout = null;
            this.loadDelay = 500; // default (in ms)

            this._initDrawings();
            this._initControls();
            this._initStats();
            this._initGUI();

            this.historyUpdated();
        },

        /* To Override */

        getInputDrawing: function() {return null;},
        getOutputDrawing: function() {return null;},
        initCamera: function(width, height) {return null;},
        positionDrawings: function(inputDrawing, outputDrawing) {},
        addGuiControls: function() {},

        // Events
        iterationChanged: function() {},

        /* Public */
        initRenderer: function() {
            return new THREE.WebGLRenderer();
        },

        render: function() {
            if (this.stats) this.stats.begin();

            this._update();
            this.controls.update();
            this.renderer.render(this.scene, this.camera);

            if (this.stats) this.stats.end();

            requestAnimationFrame(this.render.bind(this));
        },

        historyUpdated: function() {
            var num = this.history.length(),
                guiIteration = this.guiIteration;

            var min = Number(num > 0),
                max = num;

            guiIteration.__min = min;
            guiIteration.__max = max;

            if (guiIteration.getValue() === 0) {
                guiIteration.setValue(min);
            }
        },

        play: function() {
            if (!this.playing) {
                this._enableController('speed');
                this._enableController('pause');
                this._player();
                this.playing = true;
                this._changeControllerText("play", "pause");
            } else {
                this.pause();
            }
        },

        pause: function() {
            clearTimeout(this.timer);
            this.playing = false;
            this._changeControllerText("play", "play");
            this._disableController('speed');
        },

        /* Private */

        _player: function() {
            this.timer = _.delay(function(_this){
                _this.iteration++;
                if(_this.iteration < _this.guiIteration.__max) {
                    _this._player();
                } else {
                    _this.pause();
                }
            }, this._calculateSpeed(),this);
        },

        _changeControllerText: function(name, label) {
            for (var i = 0; i < this.gui.__controllers.length; i++) {
                if (this.gui.__controllers[i].property === name) {
                    this.gui.__controllers[i].name(label);
                }
            }
        },

        _calculateSpeed: function() {
            return this.maxSpeed - this.speed;
        },

        _findController: function(controllerName) {
            for (var i = 0; i < this.gui.__controllers.length; i++) {
                var controller = this.gui.__controllers[i];

                if (controller.property === controllerName) {
                    return controller;
                }
            }

            return null;
        },

        _disableController: function(controllerName) {
            var controller = this._findController(controllerName);
            if (!controller) return;

            if($(controller.__li).children(".disabled").length > 0) return;
            $(controller.__li).append("<div class='disabled'></div>");
        },

        _enableController: function(controllerName) {
            var controller = this._findController(controllerName);
            if (!controller) return;

            $(controller.__li).children().remove(".disabled");
        },

        _hideController: function(controllerName) {
            var controller = this._findController(controllerName);
            if (!controller) return;

            $(controller.__li).addClass("hidden");
        },

        _initDrawings: function() {
            var container = this.container,
                width = container.width(),
                height = container.height();

            var scene = new THREE.Scene();
            var renderer = this.initRenderer();

            var camera = this.initCamera(width, height);
            scene.add(camera);

            renderer.setSize(width, height);
            this.container.append(renderer.domElement);

            this.renderer = renderer;
            this.camera = camera;
            this.scene = scene;

            var inputDrawing = this.getInputDrawing(),
                outputDrawing = this.getOutputDrawing();

            outputDrawing.setInputDrawing(inputDrawing);

            this.inputDrawing = inputDrawing;
            this.outputDrawing = outputDrawing;

            this._watchForResize();
        },

        _watchForResize: function() {
            var renderer = this.renderer,
                camera = this.camera,
                container = this.container;

            $(window).resize(function() {
                var width = container.width(),
                    height = container.height();

                renderer.setSize(width, height);
                
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
            });
        },

        _initControls: function() {
            var camera = this.camera,
                renderer = this.renderer,
                controls = new THREE.TrackballControls(camera, renderer.domElement);

            controls.rotateSpeed = 1.0;
            controls.zoomSpeed = 1.2;
            controls.panSpeed = 0.8;

            controls.noZoom = false;
            controls.noPan = false;

            controls.staticMoving = true;
            controls.dynamicDampingFactor = 0.3;

            controls.keys = [65, 83, 68];

            this.controls = controls;
        },

        _initStats: function() {
            var stats = new Stats(),
                domElement = $(stats.domElement);

            stats.setMode(0); // 0: fps; 1: ms

            domElement.addClass("stats");
            this.container.append(domElement);

            this.stats = stats;
        },

        _initGUI: function() {
            var gui = new dat.GUI({ autoPlace: false }),
                domElement = $(gui.domElement);

            domElement.addClass("controls");
            this.container.append(domElement);

            this.next = this._nextIteration;
            this.prev = this._prevIteration;

            this.guiIteration = gui.add(this, 'iteration', 0, 0).step(1).listen();
            gui.add(this, 'play');
            gui.add(this, 'speed', 0, this.maxSpeed).step(1);
            gui.add(this, 'next');
            gui.add(this, 'prev');

            this.gui = gui;
            this.addGuiControls();
        },

        _update: function() {
            if (this.lastIteration != this.iteration) {
                this._iterationUpdated();
                this.iterationChanged(); // fire event
                this.lastIteration = this.iteration;
            }
        },

        _nextIteration: function() {
            this.pause();
            this.iteration = Math.min(this.iteration + 1, this.history.length());
        },

        _prevIteration: function() {
            this.pause();
            this.iteration = Math.max(this.iteration - 1, 1);
        },

        _iterationUpdated: function() {
            var lastSnapshot = this.snapshot,
                snapshot = this.history.getSnapshotAtIndex(this.iteration - 1);

            if (!snapshot) {
                console.log("Invalid iteration index: " + this.iteration);
                console.log("History length: " + this.history.length());
                return;
            }

            this.snapshot = snapshot;

            this._load();

            var inputDimensions = snapshot.getInputCellRegion().getDimensions(),
                outputDimensions = snapshot.getOutputCellRegion().getDimensions(),
                inputDimensionsChanged = true,
                outputDimensionsChanged = true,
                inputDrawing = this.inputDrawing,
                outputDrawing = this.outputDrawing;

            inputDrawing.setRegionDimensions(_.cloneDeep(inputDimensions), this.reshape);
            outputDrawing.setRegionDimensions(_.cloneDeep(outputDimensions), this.reshape);

            if (lastSnapshot) {
                var lastInputDimensions = lastSnapshot.getInputCellRegion().getDimensions(),
                    lastOutputDimensions = lastSnapshot.getOutputCellRegion().getDimensions();

                if (_.isEqual(inputDimensions, lastInputDimensions))
                    inputDimensionsChanged = false;

                if (_.isEqual(outputDimensions, lastOutputDimensions))
                    outputDimensionsChanged = false;
            }

            if (inputDimensionsChanged || outputDimensionsChanged) {
                this._redraw();
            }
        },

        _reshapeUpdated: function() {
            var inputDrawing = this.inputDrawing,
                outputDrawing = this.outputDrawing,
                snapshot = this.snapshot,
                inputDimensions = snapshot.getInputCellRegion().getDimensions(),
                outputDimensions = snapshot.getOutputCellRegion().getDimensions();

            this._load();
            
            inputDrawing.setRegionDimensions(inputDimensions, this.reshape);
            outputDrawing.setRegionDimensions(outputDimensions, this.reshape);

            this._redraw();
        },

        _redraw: function() {
            var inputDrawing = this.inputDrawing,
                outputDrawing = this.outputDrawing,
                scene = this.scene;

            inputDrawing.clear();
            inputDrawing.setup();

            outputDrawing.clear();
            outputDrawing.setup();

            this.positionDrawings(inputDrawing, outputDrawing);

            scene.add(outputDrawing.getObject3D());
            scene.add(inputDrawing.getObject3D());
        },

        _load: function() {
            var self = this,
                snapshot = this.snapshot,
                inputCellRegion = snapshot.getInputCellRegion(),
                outputCellRegion = snapshot.getOutputCellRegion(),
                inputDrawing = this.inputDrawing,
                outputDrawing = this.outputDrawing,
                timeout = this.loadTimeout,
                delay = this.loadDelay;

            inputDrawing.reset();
            inputDrawing.updateCells();

            outputDrawing.reset();
            outputDrawing.updateCells();
            outputDrawing.updateProximalSynapses();
            outputDrawing.updateDistalSynapses();

            if (timeout) clearTimeout(timeout);

            timeout = setTimeout(function() {
                inputCellRegion.getActiveCells(_.bind(function(error, activeCells) {
                    if (self.snapshot != this) return;

                    self.inputDrawing.setActiveCells(activeCells);
                    self.inputDrawing.updateCells();
                }, snapshot));

                outputCellRegion.getActiveColumns(_.bind(function(error, activeColumns) {
                    if (self.snapshot != this) return;

                    self.outputDrawing.setActiveColumns(activeColumns);
                    self.outputDrawing.updateCells();
                }, snapshot));

                outputCellRegion.getActiveCells(_.bind(function(error, activeCells) {
                    if (self.snapshot != this) return;

                    self.outputDrawing.setActiveCells(activeCells);
                    self.outputDrawing.updateCells();
                }, snapshot));

                outputCellRegion.getPredictedCells(_.bind(function(error, predictedCells) {
                    if (self.snapshot != this) return;

                    self.outputDrawing.setPredictedCells(predictedCells);
                    self.outputDrawing.updateCells();
                }, snapshot));

                outputCellRegion.getProximalSynapses(_.bind(function(error, proximalSynapses) {
                    if (self.snapshot != this) return;

                    self.outputDrawing.setProximalSynapses(proximalSynapses);
                    self.outputDrawing.updateProximalSynapses();
                }, snapshot));

                outputCellRegion.getDistalSynapses(_.bind(function(error, distalSynapses) {
                    if (self.snapshot != this) return;

                    self.outputDrawing.setDistalSynapses(distalSynapses);
                    self.outputDrawing.updateDistalSynapses();
                }, snapshot));
            }, delay);

            this.loadTimeout = timeout;
        }
    };
});
