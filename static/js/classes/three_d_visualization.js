var ThreeDVisualization = Visualization.extend(function(base) {
    return {
        init: function(container, history) {
            base.init.call(this, container, history);

            this.particleSystem = null;
        },

        /* Overrides */

        setupRegion: function() {
            var paddingX = 100,
                paddingY = 100,
                paddingZ = 25,
                dimensions = this.snapshot.getRegionDimensions(),
                numX = dimensions[0],
                numY = dimensions[1],
                numZ = dimensions[2],
                originX = -(numX * paddingX) / 2,
                originY = -(numY * paddingY) / 2,
                originZ = -(numZ * paddingZ) / 2;

            var particles = new THREE.Geometry(),
                material = new THREE.ParticleBasicMaterial({
                    size: 20,
                    map: THREE.ImageUtils.loadTexture(
                        "img/particle.png"
                    ),
                    blending: THREE.NormalBlending,
                    transparent: true,
                    vertexColors: true
                }),
                particleSystem = new THREE.ParticleSystem(particles, material);

            particleSystem.sortParticles = true;
            particleSystem.rotation.x = -(Math.PI / 2);

            for (var x = 0; x < numX; x++) {
                for (var y = 0; y < numY; y++) {
                    for (var z = 0; z < numZ; z++) {
                        var pX = originX + x * paddingX,
                            pY = originY + y * paddingY,
                            pZ = originZ + z * paddingZ,
                            particle = new THREE.Vector3(pX, pY, pZ);

                        particles.vertices.push(particle);
                        particles.colors.push(new THREE.Color(0xAAAAAA));
                    }
                }
            }

            this.scene.add(particleSystem);

            this.particleSystem = particleSystem;
        },

        clearRegion: function() {
            if (!this.particleSystem) return;

            this.scene.remove(this.particleSystem);
        },

        updateRegion: function() {
            if (!this.particleSystem) return;

            var particles = this.particleSystem.geometry,
                activeCells = this.activeCells,
                predictiveCells = this.predictiveCells;

            for (var i = 0; i < particles.vertices.length; i++) {
                if (this.showActiveCells && _.contains(activeCells, i)) {
                    particles.colors[i].setHex(0xFFFFFF);
                }
                else if (this.showPredictiveCells && _.contains(predictiveCells, i)) {
                    particles.colors[i].setHex(0xAA0000);
                }
                else {
                    particles.colors[i].setHex(0x222222);
                }
            }
        }
    };
});
