var NetworkCoordinateEncoderRegion = NetworkEncoderRegion.extend(function(base) {
    return {
        /* Public */

        getNeighbors: function(callback) {
            this.getList("neighbors", callback);
        },

        getTopWCoordinates: function(callback) {
            this.getList("top_w_coordinates", callback);
        },
    };
});

Fiber.mixin(NetworkCoordinateEncoderRegion, NetworkMixin);
