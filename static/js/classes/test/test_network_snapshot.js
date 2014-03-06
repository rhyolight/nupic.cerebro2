var TestNetworkSnapshot = AbstractSnapshot.extend(function() {
    return {
        init: function(regionDimensions, activeCells, predictiveCells) {
            this.regionDimensions = regionDimensions;
            this.activeCells = activeCells;
            this.predictiveCells = predictiveCells;
        },

        /* Public */
        
        getRegionDimensions: function() {
            return this.regionDimensions;
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
