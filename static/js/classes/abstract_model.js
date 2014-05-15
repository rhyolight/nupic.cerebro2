var AbstractModel = Fiber.extend(function() {
    return {
        init: function() {},

        /* To override
            Note: callbacks params follow Node.js convention of (error, retVal)
        */

        getNextSnapshot: function(callback) {
            /* Return:
                A Snapshot
            */
            callback(null, null);
        }
    };
});
