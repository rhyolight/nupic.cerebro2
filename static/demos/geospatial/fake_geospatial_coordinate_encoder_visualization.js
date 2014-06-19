var FakeGeospatialCoordinateEncoderVisualization = CoordinateEncoderVisualization.extend(function(base) {
    return {
        init: function(container, history, name) {
            base.init.call(this, container, history, name);

            this.map = null;
        },

        /* Private */

        _redraw: function() {
            var region = this.getRegion();
            if (!region) {
                console.log("Error in redraw: region not found.")
                return;
            }

            if (!this.map) this._addMap();

            base._redraw.call(this);
        },

        _addMap: function() {
            var scene = this.scene,
                width = 2552 / 4,
                height = 1262 / 4;

            var img = new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture('map.png'),
                transparent: true,
                opacity: 0.5
            });
            img.map.needsUpdate = true;

            var plane = new THREE.Mesh(new THREE.PlaneGeometry(width, height), img);
            plane.overdraw = true;
            plane.position.setZ(-1);

            scene.add(plane);

            this.map = plane;
        },
    };
});
