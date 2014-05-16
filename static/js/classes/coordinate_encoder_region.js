var CoordinateEncoderRegion = EncoderRegion.extend(function() {
    return {
        /* Public */

        /* To override
            Note: callbacks params follow Node.js convention of (error, retVal)
        */

        getNeighbors: function(callback) {
            /* Return:
                A list of coordinates, each one a list
                    Example: [[7, 9], [47, 74], ...]
            */
            callback(null, []);
        },

        getTopWCoordinates: function(callback) {
            /* Return:
                A list of coordinates, each one a list
                    Example: [[3, 29], [47, 74], ...]
            */
            callback(null, []);
        },
    };
});
