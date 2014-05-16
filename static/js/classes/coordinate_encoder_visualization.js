var CoordinateEncoderVisualization = EncoderVisualization.extend(function(base) {
    return {
        init: function(container, history, name) {
            this.name = name;
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

            this.resetCamera = this._resetCamera;
            this.focusCamera = this._focusCamera;

            var cameraFolder = this.gui.addFolder('Camera');
            cameraFolder.add(this, 'resetCamera');
            cameraFolder.add(this, 'focusCamera');
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
        },

        _resetCamera: function() {
            var camera = this.camera,
                controls = this.controls;

            camera.position.set(300, 500, 1200);
            controls.target = new THREE.Vector3(0, 0, 0);
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
                center = new THREE.Vector3().addVectors(min, max).divideScalar(2);
                z = Math.max.apply(Math, size.toArray()) * 5,
                overCenter = new THREE.Vector3().copy(center).setZ(z);

            camera.position = overCenter;
            controls.target = center;
        },
    };
});
