var Snapshot = Fiber.extend(function() {
    return {
        init: function(inputLayer, outputLayer) {
            this.inputLayer = inputLayer;
            this.outputLayer = outputLayer;
        },

        getInputLayer: function() {
            return this.inputLayer;
        },

        getOutputLayer: function() {
            return this.outputLayer;
        }
    };
});
