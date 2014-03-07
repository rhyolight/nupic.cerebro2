var AbstractSnapshot = Fiber.extend(function() {
    return {
        init: function(input, regionDimensions) {
            this.input = input;
            this.regionDimensions = regionDimensions;
        },

        getInput: function() {
            return this.input;
        },
        
        getRegionDimensions: function() {
            return _.clone(this.regionDimensions);
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
                A list of indices, one for each cell with permanence > 0
                    Example: [10,   79,    497, ...])
                A list of floats, one for each index above, representing permanence value
                    Example: [0.34, 0.745, 0.22, ...]
            */
            callback(null, [], []);
        }
    };
});
