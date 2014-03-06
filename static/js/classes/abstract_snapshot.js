var AbstractSnapshot = Fiber.extend(function() {
    return {
        init: function(regionDimensions) {
            this.regionDimensions = regionDimensions;
        },

        getRegionDimensions: function() {
            return _.clone(this.regionDimensions);
        },
        
        /* To override */

        getActiveCells:     function(callback) { callback(null, []); },
        getPredictiveCells: function(callback) { callback(null, []); }
    };
});
