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

			this.iteration = 0;
		},

		setup: function() {
			this._initScene();
			this._initControls();
			this._initStats();
			this._initGUI();

			this.historyUpdated();

			return this;
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

		/* Private */

		_update: function() {},

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

			camera.position.x = 500;
			camera.position.y = 1000;
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

			this.gui = gui;
		}
	};
});
