var AbstractDrawing = Fiber.extend(function() {
    return {
        init: function() {
            this.object3D = new THREE.Object3D();
            this.reset();
        },

        /* Public */

        getObject3D: function() {
            return this.object3D;
        },

        reset: function() {},

        /* To override */

        setup: function() {},

        getSize: function() {
            /* Return:
                   THREE.Vector3 containing size of drawing
            */
            return null;
        },

        clear: function() {},
    };
});
