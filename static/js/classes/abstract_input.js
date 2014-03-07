var AbstractInput = Fiber.extend(function() {
    return {
        init: function(dimensions) {
            this.dimensions = dimensions;
        },
        
        /* To override */

        getBits: function(callback) { callback(null, []); },
    };
});
