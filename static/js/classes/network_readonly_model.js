var NetworkReadonlyModel = AbstractModel.extend(function(base) {
    return {
        init: function(modelURL) {
            base.init.call(this);
            this.modelURL = modelURL;

            this.inputDimensions = null;
            this.outputDimensions = null;
            this.numSnapshots = 0;

            this.getDimensions();
        },

        getDimensions: function() {
            var self = this;

            self.getJSON("input/dimensions", function(error, inputDimensions) {
                self.inputDimensions = inputDimensions;
            });

            self.getJSON("output/dimensions", function(error, outputDimensions) {
                self.outputDimensions = outputDimensions;
            });
        },

        /* Public */

        getNextSnapshot: function(callback) {
            var inputDimensions = this.inputDimensions,
                outputDimensions = this.outputDimensions;

            // TODO: Remove numSnapshots <= 10 limitation
            if (!inputDimensions || !outputDimensions || this.numSnapshots > 10) {
                callback(null, null);
                return;
            }

            var iteration = this.numSnapshots,
                modelURL = this.modelURL,
                inputLayer = new NetworkLayer(inputDimensions,
                                              "input",
                                              iteration,
                                              modelURL),
                outputLayer = new NetworkLayer(outputDimensions,
                                              "output",
                                              iteration,
                                              modelURL),
                snapshot = new Snapshot(inputLayer, outputLayer);

            this.numSnapshots += 1;
            callback(null, snapshot);
        }
    };
});

Fiber.mixin(NetworkReadonlyModel, NetworkMixin);
