var CellVisualization = AbstractVisualization.extend(function(base) {
    return {
        init: function(container, history) {
            this.reshape = true;

            this._initDrawings();

            base.init.call(this, container, history);
        },

        /* To Override */

        getInputDrawing: function() {return null;},
        getOutputDrawing: function() {return null;},
        positionDrawings: function(inputDrawing, outputDrawing) {},

        /* Public */

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

        iterationChanged: function(currentSnapshot, lastSnapshot) {
            var snapshot = currentSnapshot,
                inputDimensions = snapshot.getInputCellRegion().getDimensions(),
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
                this.redraw();
            }
        },

        reset: function() {
            var inputDrawing = this.inputDrawing,
                outputDrawing = this.outputDrawing;

            inputDrawing.reset();
            inputDrawing.updateCells();

            outputDrawing.reset();
            outputDrawing.updateCells();
            outputDrawing.updateProximalSynapses();
            outputDrawing.updateDistalSynapses();
        },

        loadData: function() {
            var self = this,
                snapshot = this.snapshot,
                inputCellRegion = snapshot.getInputCellRegion(),
                outputCellRegion = snapshot.getOutputCellRegion(),
                inputDrawing = this.inputDrawing,
                outputDrawing = this.outputDrawing;

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
        },

        redraw: function() {
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

        /* Private */

        _initDrawings: function() {
            var inputDrawing = this.getInputDrawing(),
                outputDrawing = this.getOutputDrawing();

            outputDrawing.setInputDrawing(inputDrawing);

            this.inputDrawing = inputDrawing;
            this.outputDrawing = outputDrawing;
        },

        _reshapeUpdated: function() {
            var inputDrawing = this.inputDrawing,
                outputDrawing = this.outputDrawing,
                snapshot = this.snapshot,
                inputDimensions = snapshot.getInputCellRegion().getDimensions(),
                outputDimensions = snapshot.getOutputCellRegion().getDimensions();

            this.readyToLoadData();
            this.reset();
            
            inputDrawing.setRegionDimensions(inputDimensions, this.reshape);
            outputDrawing.setRegionDimensions(outputDimensions, this.reshape);

            this.redraw();
        },

        _calculateCameraDistance: function(axis) {
            var inputSize = this.inputDrawing.getSize(),
                outputSize = this.outputDrawing.getSize(),
                size = new THREE.Vector3().addVectors(inputSize, outputSize),
                height = (axis === "z") ? size.y : size.z,
                max = Math.max(size.x, height),
                min = Math.min(2000, max);
            // equation based on: http://stackoverflow.com/questions/14614252/how-to-fit-camera-to-object
            var dist = (min / 2) / Math.tan(Math.PI * this.camera.fov / 360);
            return dist;
        }
    };
});
