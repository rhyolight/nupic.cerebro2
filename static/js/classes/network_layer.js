var NetworkLayer = AbstractLayer.extend(function(base) {
    return {
        init: function(dimensions, layer, iteration, modelURL) {
            base.init.call(this, dimensions);
            this.layer = layer;
            this.iteration = iteration;
            this.modelURL = modelURL;
        },

        getList: function(type, callback) {
            var self = this,
                layer = this.layer,
                iteration = this.iteration;

            self.getJSON(layer + "/" + iteration + "/" + type, function(error, list) {
                callback(null, list);
            });
        },

        /* Public */

        getActiveColumns: function(callback) {
            this.getList("active_columns", callback);
        },

        getActiveCells: function(callback) {
            this.getList("active_cells", callback);
        },

        getPredictedCells: function(callback) {
            this.getList("predicted_cells", callback);
        },

        getProximalSynapses: function(callback) {
            var self = this,
                dimensions = this.dimensions,
                cellsPerColumn = dimensions[2];

            this.getList("proximal_synapses", function(error, proximalSynapses) {
                for (var i = 0; i < proximalSynapses.length; i++) {
                    // Convert column index to index of first cell in the column
                    var synpase = proximalSynapses[i];
                    synpase[0] *= cellsPerColumn;
                    proximalSynapses[i] = synpase;
                }

                callback(error, proximalSynapses);
            });
        }
    };
});

Fiber.mixin(NetworkLayer, NetworkMixin);
