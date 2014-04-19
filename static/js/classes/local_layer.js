var LocalLayer = AbstractLayer.extend(function(base) {
    return {
        init: function(dimensions, activeColumns, activeCells, predictedCells, proximalSynapses, distalSynapses) {
            base.init.call(this, dimensions);

            this.activeColumns    = activeColumns;
            this.activeCells      = activeCells;
            this.predictedCells  = predictedCells;
            this.proximalSynapses = proximalSynapses;
            this.distalSynapses   = distalSynapses;
        },

        /* Public */
        
        getActiveColumns: function(callback) {
            callback(null, _.clone(this.activeColumns));
        },

        getActiveCells: function(callback) {
            callback(null, _.clone(this.activeCells));
        },

        getPredictedCells: function(callback) {
            callback(null, _.clone(this.predictedCells));
        },

        getProximalSynapses: function(callback) {
            callback(null, _.clone(this.proximalSynapses));
        },

        getDistalSynapses: function(callback) {
            callback(null, _.clone(this.distalSynapses));
        }
    };
});
