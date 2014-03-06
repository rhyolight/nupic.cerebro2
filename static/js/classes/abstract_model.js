var AbstractModel = Fiber.extend(function() {
    return {
        init: function() {},

        /* To override */

        run: function(input, callback) { callback(null, null); },
    };
});
