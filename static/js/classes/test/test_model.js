var TestModel = AbstractModel.extend(function(base) {
    return {
        init: function() {
            base.init.call(this);

            this.outputLayers = [];
        },

        /* Public */

        pushOutputLayer: function(outputLayer) {
            this.outputLayers.push(outputLayer);
        },

        popOutputLayer: function() {
            return this.outputLayers.pop();
        },

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

            callback(null, snapshot);
        }
    };
});
