var AbstractLayer = Fiber.extend(function() {
    return {
        init: function(dimensions) {
            this.dimensions = dimensions;
        },

        /* Public */

        getDimensions: function() {
            return _.clone(this.dimensions);
        },

        /* To override
            Note: callbacks params follow Node.js convention of (error, retVal)
        */

        getActiveCells: function(callback) {
            /* Return:
                A list of indices, one for each active cell
                    Example: [3, 29, 47, ...]
            */
            callback(null, []);
        },

        getPredictiveCells: function(callback) {
            /* Return:
                A list of indices, one for each predictive cell
                    Example: [5, 74, 235, ...]
            */
            callback(null, []);
        },

        getProximalSynapses: function(callback) {
            /* Return:
                A list of proximal connections, each represented by a list: [toIndex, fromIndex, permanence]
                    ...where fromIndex is the index of a cell in the input layer,
                             toIndex is the index of a cell in the current layer,
                             permanence is the permanence value of the proximal connection.
            */
            callback(null, []);
        }
    };
});
