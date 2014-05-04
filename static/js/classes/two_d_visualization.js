var TwoDVisualization = AbstractVisualization.extend(function(base) {
    return {
        initCamera: function(width, height) {
            var viewAngle = 45,
                aspect = width / height,
                near = 0.1,
                far = 10000;
                camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);

            camera.position.z = 1000;
            
            return camera;
        },

        getInputDrawing: function(scene) {
            return new TwoDDrawing(scene, 0, -200);
        },

        getOutputDrawing: function(scene) {
            return new TwoDDrawing(scene, 0, 200);
        }
    };
});
