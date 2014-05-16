var Snapshot = Fiber.extend(function() {
    return {
        init: function() {
            this.encoders = {};
        },

        setInputCellRegion: function(inputCellRegion) {
            this.inputCellRegion = inputCellRegion;
        },

        getInputCellRegion: function() {
            return this.inputCellRegion;
        },

        setOutputCellRegion: function(outputCellRegion) {
            this.outputCellRegion = outputCellRegion;
        },

        getOutputCellRegion: function() {
            return this.outputCellRegion;
        },

        addEncoderRegion: function(encoderRegion) {
            this.encoders[encoderRegion.getName()] = encoderRegion;
        },

        getEncoderRegion: function(name) {
            return this.encoders[name];
        }
    };
});
