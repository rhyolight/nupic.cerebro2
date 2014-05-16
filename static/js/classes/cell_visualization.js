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

        initGUI: function() {
            base.initGUI.call(this);

            var reshapeUpdated = _.bind(this._reshapeUpdated , this);
            this.gui.add(this, 'reshape').onChange(reshapeUpdated);
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
                this._redraw();
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
    };
});
