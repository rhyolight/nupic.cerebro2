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

        getActiveColumns: function(callback) {
            /* Return:
                A list of indices, one for each active column
                    Example: [2, 5, 9, ...]
            */
            callback(null, []);
        },

        getActiveCells: function(callback) {
            /* Return:
                A list of indices, one for each active cell
                    Example: [3, 29, 47, ...]
            */
            callback(null, []);
        },

        getPredictedCells: function(callback) {
            /* Return:
                A list of indices, one for each predicted cell
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
        },

        getDistalSynapses: function(callback) {
            /* Return:
                A list of distal connections, each represented by a list: [toIndex, fromIndex, permanence]
                    ...where fromIndex is the index of a cell in the current layer,
                             toIndex is the index of a cell in the current layer,
                             permanence is the permanence value of the distal connection.

                TODO: Verify that this makes sense.
            */
            callback(null, []);
        }
    };
});
