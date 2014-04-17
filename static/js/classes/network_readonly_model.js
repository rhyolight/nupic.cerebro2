var NetworkReadonlyModel = AbstractModel.extend(function(base) {
    return {
        init: function(modelURL) {
            base.init.call(this);
            this.modelURL = modelURL;

            this.inputDimensions = [];
            this.outputDimensions = [];
        },

        /* Public */

        getNextSnapshot: function(callback) {
            callback(null, null);
        }
    };
});
