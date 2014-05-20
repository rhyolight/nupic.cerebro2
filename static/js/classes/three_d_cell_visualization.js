var ThreeDCellVisualization = CellVisualization.extend(function(base) {
    return {
        
        positionCamera: function() {
            this.viewDefault();
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

            var cameraControls = this.gui.addFolder('Camera');
            cameraControls.add(this, 'viewDefault').name('default');
            cameraControls.add(this, 'viewFront').name('front');
            cameraControls.add(this, 'viewBack').name('back');
            cameraControls.add(this, 'viewTop').name('top');
            cameraControls.add(this, 'viewBottom').name('bottom');
            cameraControls.add(this, 'viewLeft').name('left');
            cameraControls.add(this, 'viewRight').name('right');
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
