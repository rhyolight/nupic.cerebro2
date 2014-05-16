var Snapshot = Fiber.extend(function() {
    return {
        init: function(inputCellRegion, outputCellRegion) {
            this.inputCellRegion = inputCellRegion;
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
