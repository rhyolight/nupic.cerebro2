var AbstractDrawing = Fiber.extend(function() {
    return {
        init: function(scene) {
            this.scene = scene;

            this.layerDimensions = null;
            this.inputDrawing = null;
            this.reset();

            this.showActiveColumns = true;
            this.showActiveCells = true;
            this.showPredictiveCells = true;
            this.showProximalSynapses = true;
            this.showDistalSynapses = true;
        },

        /* Public */

        setLayerDimensions: function(layerDimensions) {
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

        setPredictiveCells: function(predictiveCells) {
            this.predictiveCells = predictiveCells;
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
            this.predictiveCells = [];
            this.proximalSynapses = [];
            this.distalSynapses = [];
        },

        /* To override */

        setup: function() {},

        clear: function() {},

        updateCells: function() {},

        updateProximalSynapses: function() {},

        updateDistalSynapses: function() {}
    };
});
