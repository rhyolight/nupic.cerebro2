var NetworkReadonlyModel = AbstractModel.extend(function(base) {
    return {
        init: function(modelURL) {
            base.init.call(this);
            this.modelURL = modelURL;

            this.inputDimensions = null;
            this.outputDimensions = null;
            this.encoders = null;
            this.numIterations = 0;
            this.numSnapshots = 0;

            this.getNumIterations();
            this.getDimensions();
            this.getEncoders();
        },

        getNumIterations: function() {
            var self = this;

            self.getJSON("num_iterations", function(error, numIterations) {
                self.numIterations = numIterations;
            });
        },

        getDimensions: function() {
            var self = this;

            self.getJSON("dimensions/input", function(error, inputDimensions) {
                self.inputDimensions = inputDimensions || [];
            });

            self.getJSON("dimensions/output", function(error, outputDimensions) {
                self.outputDimensions = outputDimensions || [];
            });
        },

        getEncoders: function() {
            var self = this;

            self.getJSON("encoders", function(error, encoders) {
                encoders = encoders || [];
                self.encoders = encoders;
            });
        },

        /* Public */

        getNextSnapshot: function(callback) {
            var inputDimensions = this.inputDimensions,
                outputDimensions = this.outputDimensions,
                encoders = this.encoders;

            if (!inputDimensions ||
                !outputDimensions ||
                !encoders ||
                this.numSnapshots >= this.numIterations) {
                callback(null, null);
                return;
            }

            var iteration = this.numSnapshots + 1,
                modelURL = this.modelURL,
                snapshot = new Snapshot();

            var inputCellRegion = new NetworkCellRegion(inputDimensions,
                                                        "input",
                                                        iteration,
                                                        modelURL),
                outputCellRegion = new NetworkCellRegion(outputDimensions,
                                                         "output",
                                                         iteration,
                                                         modelURL);

            snapshot.setInputCellRegion(inputCellRegion);
            snapshot.setOutputCellRegion(outputCellRegion);

            for (i in encoders) {
                var encoder = encoders[i],
                    name = encoder.name,
                    cls = encoder.cls,
                    params = encoder.parameters,
                    regionClass = window["Network" + cls + "Region"] || NetworkEncoderRegion,
                    encoderRegion = new regionClass(name,
                                                    params,
                                                    iteration,
                                                    modelURL);

                snapshot.addEncoderRegion(encoderRegion);
            }

            this.numSnapshots += 1;
            callback(null, snapshot);
        }
    };
});

Fiber.mixin(NetworkReadonlyModel, NetworkMixin);
