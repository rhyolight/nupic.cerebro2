var NetworkEncoderRegion = EncoderRegion.extend(function(base) {
    return {
        init: function(name, iteration, modelURL) {
            base.init.call(this, name);
            this.iteration = iteration;
            this.modelURL = modelURL;
        },

        getList: function(type, callback) {
            var self = this,
                name = this.name,
                iteration = this.iteration,
                path = "states" + "/" + iteration + "/encoders/" + name + "/" + type;

            self.getJSON(path, function(error, list) {
                list = list || [];
                callback(null, list);
            });
        },

        /* Public */

        getInput: function(callback) {
            this.getList("input", callback);
        },

        getOutput: function(callback) {
            this.getList("output", callback);
        },
    };
});

Fiber.mixin(NetworkEncoderRegion, NetworkMixin);
