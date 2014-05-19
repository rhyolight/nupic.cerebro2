var CoordinateEncoderVisualization = EncoderVisualization.extend(function(base) {
    return {
        init: function(container, history, name) {
            this.name = name;
            this.autofocus = true;

            base.init.call(this, container, history, name);

            this.coordinateDrawing = new CoordinateSystemDrawing();
        },

        /* Public */

        loadData: function() {
            var region = this.getRegion();
            if (!region) return;

            var self = this,
                name = this.name,
                coordinateDrawing = this.coordinateDrawing;

            coordinateDrawing.reset();

            region.getNeighbors(function(error, neighbors) {
                coordinateDrawing.setNeighbors(neighbors);

                region.getTopWCoordinates(function(error, topWCoordinates) {
                    coordinateDrawing.setTopWCoordinates(topWCoordinates);

                    self._redraw();
                });
            });
        },

        initGUI: function() {
            base.initGUI.call(this);

            var autoFocusCamera = _.bind(this._autoFocusCamera , this);
            this.resetCamera = this._resetCamera;

            var cameraFolder = this.gui.addFolder('Camera');
            cameraFolder.add(this, 'resetCamera');
            cameraFolder.add(this, 'autofocus').onChange(autoFocusCamera);
            cameraFolder.open();
        },

        /* Private */

        _redraw: function() {
            var scene = this.scene,
                coordinateDrawing = this.coordinateDrawing;

            coordinateDrawing.clear();
            coordinateDrawing.setup();
            coordinateDrawing.updateParticles();

            scene.add(coordinateDrawing.getObject3D());

            this._autoFocusCamera();
        },

        _initScene: function() {  // TODO: make initScene a public method in AbstractVisualization
            base._initScene.call(this);

            this._addGrid();
        },

        _addGrid: function() {
            var scene = this.scene,
                size = 5000,
                step = 10;

            var geometry = new THREE.Geometry();
            var material = new THREE.LineBasicMaterial({
                color: 0x777777,
                opacity: 0.1
            });

            for (var i = -size; i <= size; i += step) {
                geometry.vertices.push(new THREE.Vector3(-size, i, 0));
                geometry.vertices.push(new THREE.Vector3( size, i, 0));

                geometry.vertices.push(new THREE.Vector3(i, -size, 0));
                geometry.vertices.push(new THREE.Vector3(i,  size, 0));
            }

            var line = new THREE.Line(geometry, material, THREE.LinePieces);
            scene.add(line);
        },

        _resetCamera: function() {
            var camera = this.camera,
                controls = this.controls;

            camera.position.set(300, 500, 1200);
            controls.target = new THREE.Vector3(0, 0, 0);
        },

        _autoFocusCamera: function() {
            if (this.autofocus) {
                this._focusCamera();
            }
        },

        _focusCamera: function() {
            var camera = this.camera,
                controls = this.controls,
                coordinateDrawing = this.coordinateDrawing,
                particleSystem = coordinateDrawing.particleSystem;
                geometry = particleSystem.geometry;

            geometry.computeBoundingBox();

            var min = geometry.boundingBox.min,
                max = geometry.boundingBox.max,
                size = new THREE.Vector3().subVectors(max, min),
                center = new THREE.Vector3().addVectors(min, max).divideScalar(2),
                maxSize = Math.max.apply(Math, size.toArray()),
                z = Math.sqrt(maxSize) * 10,
                overCenter = new THREE.Vector3().copy(center).setZ(z),
                duration = 350,
                easing = TWEEN.Easing.Exponential.InOut;

            new TWEEN.Tween(camera.position).to({
                    x: overCenter.x,
                    y: overCenter.y,
                    z: overCenter.z},
                duration).easing(easing).start();
            new TWEEN.Tween(controls.target).to({
                    x: center.x,
                    y: center.y,
                    z: center.z},
                duration).easing(easing).start();
        },
    };
});
