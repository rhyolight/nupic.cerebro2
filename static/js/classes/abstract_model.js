var AbstractModel = Fiber.extend(function() {
    return {
        init: function() {
            this.inputLayers = [];
        },

        /* Public */

        pushInputLayer: function(inputLayer) {
            this.inputLayers.push(inputLayer);
        },

        popInputLayer: function() {
            return this.inputLayers.pop();
        },

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
