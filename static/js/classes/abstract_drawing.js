var AbstractDrawing = Fiber.extend(function() {
    return {
        init: function(scene) {
            this.scene = scene;

            this.layerDimensions = null;
            this.inputDrawing = null;
            this.reset();

            this.showActiveCells = true;
            this.showPredictiveCells = true;
            this.showProximalSynapses = true;
        },

        /* Public */

        setLayerDimensions: function(layerDimensions) {
            this.layerDimensions = layerDimensions;
        },

        setInputDrawing: function(inputDrawing) {
            this.inputDrawing = inputDrawing;
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

        reset: function() {
            this.activeCells = [];
            this.predictiveCells = [];
            this.proximalSynapses = [];
        },

        /* To override */

        setup: function() {},

        clear: function() {},

        updateCells: function() {},

        updateProximalSynapses: function() {}
    };
});
