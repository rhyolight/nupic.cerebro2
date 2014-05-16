var Snapshot = Fiber.extend(function() {
    return {
        setInputCellRegion: function(inputCellRegion) {
            this.inputCellRegion = inputCellRegion;
        },

        setOutputCellRegion: function(outputCellRegion) {
            this.outputCellRegion = outputCellRegion;
        },

        getInputCellRegion: function() {
            return this.inputCellRegion;
        },

        getOutputCellRegion: function() {
            return this.outputCellRegion;
        }
    };
});
