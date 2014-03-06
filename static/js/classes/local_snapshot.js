var LocalSnapshot = AbstractSnapshot.extend(function() {
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
            callback(null, _.clone(this.activeCells));
        },

        getPredictiveCells: function(callback) {
            callback(null, _.clone(this.predictiveCells));
        }
    };
});
