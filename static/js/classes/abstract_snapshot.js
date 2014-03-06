var AbstractSnapshot = Fiber.extend(function() {
    return {
        /* To override */

        getModelDimensions: function() {
            return [50, 50, 8];
        },
        
        getActiveCells:     function(callback) { callback(null, []); },
        getPredictiveCells: function(callback) { callback(null, []); }
    };
});
