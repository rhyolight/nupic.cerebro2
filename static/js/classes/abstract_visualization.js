var AbstractVisualization = Fiber.extend(function() {
    return {
        init: function(container, history) {
            this.container = container;
            this.history = history;

            this.loadDelay = 500; // default (in ms)

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

            this.snapshot = null;

            this.loadTimeout = null;

            this._initScene();
            this._initControls();
            this._initStats();

            this.initGUI();

            this.historyUpdated();
        },

        /* To Override */

        loadData: function() {},
        reset: function() {},

        // Events
        iterationChanged: function(currentSnapshot, lastSnapshot) {},

        /* Public */

        initRenderer: function() {
            return new THREE.WebGLRenderer();
        },

        initCamera: function(width, height) {
            var viewAngle = 45,
                aspect = width / height,
                near = 0.1,
                far = 10000;
                camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);

            return camera;
        },

        initGUI: function() {
            var gui = new dat.GUI({ autoPlace: false }),
                domElement = $(gui.domElement);

            domElement.addClass("controls");
            this.container.append(domElement);

            this.next = this._nextIteration;
            this.prev = this._prevIteration;

            this.guiIteration = gui.add(this, 'iteration', 0, 0).step(1).listen();

            this.gui = gui;
        },

        render: function() {
            if (this.stats) this.stats.begin();

            this._update();
            this.controls.update();
            this.renderer.render(this.scene, this.camera);

            if (this.stats) this.stats.end();

            requestAnimationFrame(this.render.bind(this));
        },

        readyToLoadData: function() {
            var self = this,
                timeout = this.loadTimeout,
                delay = this.loadDelay;

            if (timeout) clearTimeout(timeout);

            timeout = setTimeout(function() {
                self.loadData()
            }, delay);

            this.loadTimeout = timeout;
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
        },

        viewDefault: function() {
            var x = this._calculateCameraDistance("x");
            this.camera.position.set(-x,-x,(x/4));
            this.camera.up.set(0, 0, 1);
            this.controls.target = new THREE.Vector3(0,0,0);
        },

        viewFront: function() {
            var x = this._calculateCameraDistance("x");
            this.camera.position.set(0, -x, 0);
            this.camera.up.set(0, 0, 1);
            this.controls.target = new THREE.Vector3(0,0,0);
        },

        viewBack: function() {
            var x = this._calculateCameraDistance("x");
            this.camera.position.set(0, x, 0);
            this.camera.up.set(0, 0, 1);
            this.controls.target = new THREE.Vector3(0,0,0);
        },

        viewTop: function() {
            var z = this._calculateCameraDistance("z");
            this.camera.position.set(0, 0, z);
            this.camera.up.set(0, 1, 0);
            this.controls.target = new THREE.Vector3(0,0,0);
        },

        viewBottom: function() {
            var z = this._calculateCameraDistance("z");
            this.camera.position.set(0, 0, -z);
            this.camera.up.set(0, -1, 0);
            this.controls.target = new THREE.Vector3(0,0,0);
        },

        viewLeft: function() {
            var y = this._calculateCameraDistance("y");
            this.camera.position.set(-y,0,0);
            this.camera.up.set(0, 0, 1);
            this.controls.target = new THREE.Vector3(0,0,0);
        },

        viewRight: function() {
            var y = this._calculateCameraDistance("y");
            this.camera.position.set(y,0,0);
            this.camera.up.set(0, 0, 1);
            this.controls.target = new THREE.Vector3(0,0,0);
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
            var controller = this._findController(name);
            if(controller) {
                controller.name(label);
                return controller.property;
            } else {
                return false;
            }
        },

        _calculateSpeed: function() {
            return this.maxSpeed - this.speed;
        },

        _findController: function(controllerName) {
            // first we look in the top level
            var controller = this._findControllerHelper(this.gui, controllerName);
            if (controller) {
                return controller;
            // then the folders
            } else {
                for (folder in this.gui.__folders) {
                    controller = this._findControllerHelper(this.gui.__folders[folder], controllerName);
                    if (controller) {
                        return controller;
                    }
                }
            }
            return null;
        },

        _findControllerHelper: function(obj, controllerName) {
            for (var i = 0; i < obj.__controllers.length; i++) {
                var controller = obj.__controllers[i];
                if (controller.property === controllerName) {
                    return controller;
                }
            }
            return null;
        },

        _findFolder: function(folderName) {
            return (_.isUndefined(this.gui.__folders[folderName])) ? null : this.gui.__folders[folderName];
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

        _hideFolder: function(folderName) {
            var folder = this._findFolder(folderName);
            if (!folder) return;

            $(folder.__ul).addClass("hidden");
        },

        _initScene: function() {
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
            this.fov = this.camera.fov; // this may be used by a subclass

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

        _update: function() {
            if (this.lastIteration != this.iteration) {
                this._iterationChanged();
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

        _iterationChanged: function() {
            var lastSnapshot = this.snapshot,
                snapshot = this.history.getSnapshotAtIndex(this.iteration - 1);

            if (!snapshot) {
                console.log("Invalid iteration index: " + this.iteration);
                console.log("History length: " + this.history.length());
                return;
            }
            
            this.snapshot = snapshot;

            this.readyToLoadData();
            this.reset();

            this.iterationChanged(snapshot, lastSnapshot); // fire public event
        },

        _calculateCameraDistance: function(axis) {
            var inputSize = this.inputDrawing.getSize(),
                outputSize = this.outputDrawing.getSize(),
                size = new THREE.Vector3().addVectors(inputSize, outputSize),
                height = (axis === "z") ? size.y : size.z,
                max = Math.max(size.x,height),
                min = Math.min(2000,max);
            // equation based on: http://stackoverflow.com/questions/14614252/how-to-fit-camera-to-object
            var dist = (min / 2) / Math.tan(Math.PI * this.camera.fov / 360);
            return dist;
        },

        _updateFOV: function(value) {
            this.camera.fov = value;
            this.camera.updateProjectionMatrix();
        }
    };
});
