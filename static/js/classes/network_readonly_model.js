var NetworkReadonlyModel = AbstractModel.extend(function(base) {
    return {
        init: function(modelURL) {
            base.init.call(this);
            this.modelURL = modelURL;

            this.inputDimensions = null;
            this.outputDimensions = null;
            self.numIterations = 0;
            this.numSnapshots = 0;

            this.getNumIterations();
            this.getDimensions();
        },

        getNumIterations: function() {
            var self = this;

            self.getJSON("num_iterations", function(error, numIterations) {
                self.numIterations = numIterations;
            });
        },

        getDimensions: function() {
            var self = this;

            self.getJSON("input/dimensions", function(error, inputDimensions) {
                self.inputDimensions = inputDimensions || [];
            });

            self.getJSON("output/dimensions", function(error, outputDimensions) {
                self.outputDimensions = outputDimensions || [];
            });
        },

        /* Public */

        getNextSnapshot: function(callback) {
            var inputDimensions = this.inputDimensions,
                outputDimensions = this.outputDimensions;

            if (!inputDimensions || !outputDimensions || this.numSnapshots >= this.numIterations) {
                callback(null, null);
                return;
            }

            var iteration = this.numSnapshots + 1,
                modelURL = this.modelURL,
                inputCellRegion = new NetworkCellRegion(inputDimensions,
                                                        "input",
                                                        iteration,
                                                        modelURL),
                outputCellRegion = new NetworkCellRegion(outputDimensions,
                                                         "output",
                                                         iteration,
                                                         modelURL),
                snapshot = new Snapshot(inputCellRegion, outputCellRegion);

            this.numSnapshots += 1;
            callback(null, snapshot);
        }
    };
});

Fiber.mixin(NetworkReadonlyModel, NetworkMixin);
