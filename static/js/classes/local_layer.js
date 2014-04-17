var LocalLayer = AbstractLayer.extend(function(base) {
    return {
        init: function(dimensions, activeColumns, activeCells, predictiveCells, proximalSynapses) {
            base.init.call(this, dimensions);

            this.activeColumns = activeColumns;
            this.activeCells = activeCells;
            this.predictiveCells = predictiveCells;
            this.proximalSynapses = proximalSynapses;
        },

        /* Public */
        
        getActiveColumns: function(callback) {
            callback(null, _.clone(this.activeColumns));
        },

        getActiveCells: function(callback) {
            callback(null, _.clone(this.activeCells));
        },

        getPredictiveCells: function(callback) {
            callback(null, _.clone(this.predictiveCells));
        },

        getProximalSynapses: function(callback) {
            callback(null, _.clone(this.proximalSynapses));
        }
    };
});
