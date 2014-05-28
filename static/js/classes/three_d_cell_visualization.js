var ThreeDCellVisualization = CellVisualization.extend(function(base) {
    return {
        initRenderer: function() {
            var renderer = base.initRenderer.call(this);
            renderer.setClearColor(COLOR_DARK_BACKGROUND);
            return renderer;
        },

        initCamera: function(width, height) {
            var camera = base.initCamera.call(this, width, height);

            camera.position.set(2000, 2000, 500);
            camera.lookAt(0, 0, 0);
            camera.up.set(0, 0, 1);

            return camera;
        },

        initGUI: function() {
            base.initGUI.call(this);

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
        },

        getInputDrawing: function() {
            return new ThreeDCellDrawing();
        },

        getOutputDrawing: function() {
            return new ThreeDCellDrawing();
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
    };
});
