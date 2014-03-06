var AbstractInput = Fiber.extend(function() {
    return {
        init: function() {},
        
        /* To override */

        getBits: function(callback) { callback(null, []); },
    };
});
