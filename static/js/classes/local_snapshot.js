var LocalSnapshot = AbstractSnapshot.extend(function(base) {
    return {
        init: function(regionDimensions, activeCells, predictiveCells) {
            base.init.call(this, regionDimensions);

            this.activeCells = activeCells;
            this.predictiveCells = predictiveCells;
        },

        /* Public */
        
        getActiveCells: function(callback) {
            callback(null, _.clone(this.activeCells));
        },

        getPredictiveCells: function(callback) {
            callback(null, _.clone(this.predictiveCells));
        }
    };
});
