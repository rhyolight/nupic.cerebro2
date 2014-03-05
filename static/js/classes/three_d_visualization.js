var ThreeDVisualization = Visualization.extend(function(base) {
    return {
        init: function(container, history) {
            base.init(container, history);

            this.particleSystem = null;
            this.snapshot = null;
            this.lastIteration = null;
        },

        /* Private */

        _iterationUpdated: function() {
            this.snapshot = this.history.getSnapshotAtIndex(this.iteration - 1);

            if (this.snapshot) this._setupCells();
            else this._clearCells();
        },

        _update: function() {
            base._update();

            if (this.lastIteration != this.iteration) {
                this._iterationUpdated();
                this.lastIteration = this.iteration;
            }
        },

        _clearCells: function() {
            if (this.particleSystem) this.scene.remove(this.particleSystem);
        },

        _setupCells: function() {
            var padding = 50,
                dimensions = this.snapshot.getModelDimensions(),
                numX = dimensions[0],
                numY = dimensions[1],
                numZ = dimensions[2],
                originX = -(numX * padding) / 2,
                originY = -(numY * padding) / 2,
                originZ = -(numZ * padding) / 2;

            var particles = new THREE.Geometry(),
                material = new THREE.ParticleBasicMaterial({
                    color: 0xFFFFFF,
                    size: 20,
                    map: THREE.ImageUtils.loadTexture(
                        "img/particle.png"
                    ),
                    blending: THREE.AdditiveBlending,
                    transparent: true
                }),
                particleSystem = new THREE.ParticleSystem(particles, material);

            particleSystem.sortParticles = true;

            for (var x = 0; x < numX; x++) {
                for (var y = 0; y < numY; y++) {
                    for (var z = 0; z < numZ; z++) {
                        var pX = originX + x * padding,
                            pY = originY + y * padding,
                            pZ = originZ + z * padding,
                            particle = new THREE.Vector3(pX, pY, pZ);

                        particles.vertices.push(particle);
                    }
                }
            }

            this._clearCells();
            this.scene.add(particleSystem);

            this.particleSystem = particleSystem;
        }
    };
});
