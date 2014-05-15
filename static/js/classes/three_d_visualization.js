var ThreeDVisualization = AbstractVisualization.extend(function(base) {
    return {
        initCamera: function(width, height) {
            var viewAngle = 45,
                aspect = width / height,
                near = 0.1,
                far = 10000;
                camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);

            camera.position.set(2000, 2000, 500);
            camera.lookAt(0, 0, 0);
            camera.up.set(0, 0, 1);

            return camera;
        },

        getInputDrawing: function() {
            return new ThreeDDrawing();
        },

        getOutputDrawing: function() {
            return new ThreeDDrawing();
        },

        positionDrawings: function(inputDrawing, outputDrawing) {
            var padding = 100;

            var inputObject3D = inputDrawing.getObject3D(),
                outputObject3D = outputDrawing.getObject3D();
                inputSize = inputDrawing.getSize(),
                outputSize = outputDrawing.getSize(),
                total = Math.max(inputSize.z + outputSize.z, 100);

            inputObject3D.position.z = -(total / 4 + padding);
            outputObject3D.position.z = (total / 4 + padding);
        },

        addGuiControls: function() {
            var reshapeUpdated = _.bind(this._reshapeUpdated , this);
            this.gui.add(this, 'reshape').onChange(reshapeUpdated);
            var outputDrawing = this.outputDrawing,
                updateCells = _.bind(outputDrawing.updateCells, outputDrawing),
                updateProximalSynapses = _.bind(outputDrawing.updateProximalSynapses, outputDrawing),
                updateDistalSynapses = _.bind(outputDrawing.updateDistalSynapses, outputDrawing);

            var viewFolder = this.gui.addFolder('View');
            viewFolder.add(this.outputDrawing, 'showActiveColumns').onChange(updateCells);
            viewFolder.add(this.outputDrawing, 'showActiveCells').onChange(updateCells);
            viewFolder.add(this.outputDrawing, 'showPredictedCells').onChange(updateCells);
            viewFolder.add(this.outputDrawing, 'showProximalSynapses').onChange(updateProximalSynapses);
            viewFolder.add(this.outputDrawing, 'showDistalSynapses').onChange(updateDistalSynapses);

            // disable some controllers
            this._disableController('speed');
        }
    };
});
