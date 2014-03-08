var Visualization = Fiber.extend(function() {
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

            this.showActiveCells = true;
            this.showPredictiveCells = true;
            this.showProximalSynapses = true;

            this.iteration = 0;
            this.lastIteration = this.iteration;

            this.snapshot = null;
            this.loadLayersTimeout = null;
            this.loadLayersTimeoutDuration = 500; // default (in ms)
            this.activeCells = [];
            this.predictiveCells = [];
            this.proximalSynapses = [];

            this._initScene();
            this._initControls();
            this._initStats();
            this._initGUI();

            this.historyUpdated();
        },

        /* Public */

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

        /* To Override */

        setupDrawing:  function() {},
        clearDrawing:  function() {},
        updateDrawing: function() {},

        /* Private */

        _initScene: function() {
            var container = this.container,
                width = container.width(),
                height = container.height(),
                viewAngle = 45,
                aspect = width / height,
                near = 0.1,
                far = 10000;

            var renderer = new THREE.WebGLRenderer();
            var camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);
            var scene = new THREE.Scene();

            camera.position.z = 5000;
            scene.add(camera);

            renderer.setSize(width, height);
            this.container.append(renderer.domElement);

            this.renderer = renderer;
            this.camera = camera;
            this.scene = scene;
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

            this.guiIteration = gui.add(this, 'iteration', 0, 0).step(1);

            var callback = _.bind(this.updateDrawing, this);

            var viewFolder = gui.addFolder('View');
            viewFolder.add(this, 'showActiveCells').onChange(callback);
            viewFolder.add(this, 'showPredictiveCells').onChange(callback);
            viewFolder.add(this, 'showProximalSynapses').onChange(callback);

            this.gui = gui;
        },

        _iterationUpdated: function() {
            var lastSnapshot = this.snapshot,
                snapshot = this.history.getSnapshotAtIndex(this.iteration - 1);

            if (!snapshot) {
                console.log("Invalid iteration index: " + this.iteration);
                return;
            }

            this.snapshot = snapshot;

            this._loadLayers();

            if (lastSnapshot &&
                _.isEqual(snapshot.getInputLayer().getDimensions(),  lastSnapshot.getInputLayer().getDimensions()) &&
                _.isEqual(snapshot.getOutputLayer().getDimensions(), lastSnapshot.getOutputLayer().getDimensions())
            ) {
                this.updateDrawing();
            }
            else {
                this.clearDrawing();
                this.setupDrawing();
            }
        },

        _update: function() {
            if (this.lastIteration != this.iteration) {
                this._iterationUpdated();
                this.lastIteration = this.iteration;
            }
        },

        _loadLayers: function() {
            // TODO: should also load parts of input layer
            var self = this,
                snapshot = this.snapshot,
                outputLayer = snapshot.getOutputLayer(),
                timeout = this.loadLayersTimeout,
                timeoutDuration = this.loadLayersTimeoutDuration;

            self.activeCells = [];
            self.predictiveCells = [];

            if (timeout) clearTimeout(timeout);

            timeout = setTimeout(function() {
                outputLayer.getActiveCells(_.bind(function(error, activeCells) {
                    if (self.snapshot != this) return;

                    self.activeCells = activeCells;
                    self.updateDrawing();
                }, snapshot));

                outputLayer.getPredictiveCells(_.bind(function(error, predictiveCells) {
                    if (self.snapshot != this) return;

                    self.predictiveCells = predictiveCells;
                    self.updateDrawing();
                }, snapshot));

                outputLayer.getProximalSynapses(_.bind(function(error, proximalSynapses) {
                    if (self.snapshot != this) return;

                    self.proximalSynapses = proximalSynapses;
                    self.updateDrawing();
                }, snapshot));
            }, timeoutDuration);

            this.loadLayersTimeout = timeout;
        },

    };
});
