var TestNetworkSnapshot = AbstractSnapshot.extend(function() {
    return {
        init: function(modelDimensions, activeCells, predictiveCells) {
            this.modelDimensions = modelDimensions;
            this.activeCells = activeCells;
            this.predictiveCells = predictiveCells;
        },

        /* Public */
        
        getModelDimensions: function() {
            return this.modelDimensions;
        },

        getActiveCells: function(callback) {
            var self = this;

            setTimeout(function() {
                callback(null, _.clone(self.activeCells));
            }, 1500);
        },

        getPredictiveCells: function(callback) {
            var self = this;

            setTimeout(function() {
                callback(null, _.clone(self.predictiveCells));
            }, 2500);
        }
    };
});
