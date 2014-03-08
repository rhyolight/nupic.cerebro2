var ThreeDVisualization = AbstractVisualization.extend(function(base) {
    return {
        getInputDrawing: function(scene) {
            return new ThreeDDrawing(scene, 0, 0, -500);
        },

        getOutputDrawing: function(scene) {
            return new ThreeDDrawing(scene, 0, 0, 0);
        }
    };
});
