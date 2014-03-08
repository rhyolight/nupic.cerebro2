var LocalLayer = AbstractLayer.extend(function(base) {
    return {
        init: function(dimensions, activeCells, predictiveCells, proximalSynapses) {
            base.init.call(this, dimensions);

            this.activeCells = activeCells;
            this.predictiveCells = predictiveCells;
            this.proximalSynapses = proximalSynapses;
        },

        /* Public */
        
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
