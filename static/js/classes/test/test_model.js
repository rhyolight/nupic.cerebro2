var TestModel = AbstractModel.extend(function(base) {
    return {
        init: function() {
            base.init.call(this);

            this.outputLayers = [];

            this.initFakeData();
        },

        initFakeData: function() {
            for (var i = 0; i < 25; i++) {
                var inputLayer  = new layerClass(params, null);
                    outputLayer = new layerClass(params, inputLayer);

                this.pushInputLayer(inputLayer);
                this.pushOutputLayer(outputLayer);
            }
        },

        pushOutputLayer: function(outputLayer) {
            this.outputLayers.push(outputLayer);
        },

        popOutputLayer: function() {
            return this.outputLayers.pop();
        },

        /* Public */

        getNextSnapshot: function(callback) {
            var inputLayer = this.popInputLayer();
            if (!inputLayer) {
                callback(null, null);
                return;
            }

            var outputLayer = this.popOutputLayer();
            if (!outputLayer) {
                callback(new Error("Mismatched input/output layers in TestModel"), null);
                return;
            }

            var snapshot = new Snapshot(inputLayer, outputLayer);

            setTimeout(function() {
                callback(null, snapshot);
            }, 500);
        }
    };
});
