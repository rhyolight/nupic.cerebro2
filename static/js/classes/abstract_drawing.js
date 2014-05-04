var AbstractDrawing = Fiber.extend(function() {
    return {
        init: function(scene) {
            this.scene = scene;

            this.layerDimensions = null;
            this.inputDrawing = null;
            this.reset();

            this.showActiveColumns = true;
            this.showActiveCells = true;
            this.showPredictedCells = true;
            this.showProximalSynapses = true;
            this.showDistalSynapses = true;
        },

        /* Public */

        setLayerDimensions: function(layerDimensions, reshape) {
            this.layerDimensions = layerDimensions;
        },

        setInputDrawing: function(inputDrawing) {
            this.inputDrawing = inputDrawing;
        },

        setActiveColumns: function(activeColumns) {
            this.activeColumns = activeColumns;
        },

        setActiveCells: function(activeCells) {
            this.activeCells = activeCells;
        },

        setPredictedCells: function(predictedCells) {
            this.predictedCells = predictedCells;
        },

        setProximalSynapses: function(proximalSynapses) {
            this.proximalSynapses = proximalSynapses;
        },

        setDistalSynapses: function(distalSynapses) {
            this.distalSynapses = distalSynapses;
        },

        reset: function() {
            this.activeColumns = [];
            this.activeCells = [];
            this.predictedCells = [];
            this.proximalSynapses = [];
            this.distalSynapses = [];
        },

        reshape3Dimensions: function(dimensions) {
            var x = dimensions[0],
                y = dimensions[1],
                z = dimensions[2],
                product = x * y,
                newX = Math.round(Math.sqrt(product)),
                newY;

            while (product % newX > 0) {
                newX--;
            }
            newY = product / newX;

            return [newX, newY, z];
        },

        /* To override */

        setup: function() {},

        clear: function() {},

        updateCells: function() {},

        updateProximalSynapses: function() {},

        updateDistalSynapses: function() {}
    };
});
