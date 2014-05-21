var GeospatialCoordinateEncoderVisualization = CoordinateEncoderVisualization.extend(function(base) {
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

            base._redraw.call(this);

            var self = this,
                currentMap = this.map;

            region.getInput(function(error, input) {
                var longitude = input[0],
                    latitude = input[1],
                    scale = region.params.scale;

                if (self.map == currentMap) {
                    self._addMap(longitude, latitude, scale);
                }
            });
        },

        _addMap: function(longitude, latitude, scale) {
            // TODO: The map keeps shifting wildly because the Geospatial Coordinate Encoder's map projection is
            // different from the projection used by Google Maps.
            var self = this,
                scene = this.scene,
                boundingBox = this._particleSystemBoundingBox(),
                min = boundingBox.min,
                max = boundingBox.max,
                center = new THREE.Vector3().addVectors(min, max).divideScalar(2),
                img = new Image,
                canvas = document.createElement("canvas"),
                ctx = canvas.getContext("2d"),
                zoom = Math.round(12 - scale / 30),
                width = 500,
                height = 500,
                scale = 2,
                src = "http://maps.googleapis.com/maps/api/staticmap?center="+latitude+","+longitude+"&size="+width+"x"+height+"&scale="+scale+"&sensor=true&zoom="+zoom;

            /* From https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image */
            img.crossOrigin = "Anonymous";

            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                localStorage.setItem("savedImageData", canvas.toDataURL("image/png"));

                var texture = new THREE.Texture(canvas);
                texture.needsUpdate = true;

                var material = new THREE.MeshBasicMaterial({map: texture});

                var mesh = new THREE.Mesh(new THREE.PlaneGeometry(canvas.width, canvas.height), material);
                mesh.doubleSided = true;
                mesh.position = center;
                mesh.position.setZ(-1); // slightly behind origin plane

                if (self.map) scene.remove(self.map);
                scene.add(mesh);

                self.map = mesh;
            }
            img.src = src;
            // make sure the load event fires for cached images too
            if (img.complete || img.complete === undefined) {
                img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
                img.src = src;
            }
        },
    };
});
