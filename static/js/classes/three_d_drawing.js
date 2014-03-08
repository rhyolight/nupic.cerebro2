var ThreeDDrawing = AbstractDrawing.extend(function(base) {
    return {
        init: function(scene, originX, originY, originZ) {
            base.init.call(this, scene);

            this.originX = originX;
            this.originY = originY;
            this.originZ = originZ;

            this.particleSystem = null;
        },

        /* Public */

        setup: function() {
            var paddingX = 100,
                paddingY = 100,
                paddingZ = 25,
                dimensions = this.layerDimensions;

            if (dimensions.length != 3) {
                throw new Error("ThreeDVisualization only supports 3-dimensional layers");
            }

            var numX = dimensions[0],
                numY = dimensions[1],
                numZ = dimensions[2],
                originX = this.originX + (-(numX * paddingX) / 2),
                originY = this.originY + (-(numY * paddingY) / 2),
                originZ = this.originZ + (-(numZ * paddingZ) / 2);

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

        clear: function() {
            if (!this.particleSystem) return;

            this.scene.remove(this.particleSystem);
        },

        updateCells: function() {
            if (!this.particleSystem) return;

            var particles = this.particleSystem.geometry,
                activeCells = this.activeCells,
                predictiveCells = this.predictiveCells,
                showActiveCells = this.showActiveCells,
                showPredictiveCells = this.showPredictiveCells;

            for (var i = 0; i < particles.vertices.length; i++) {
                if (showActiveCells && _.contains(activeCells, i)) {
                    particles.colors[i].setHex(0xFFFFFF);
                }
                else if (showPredictiveCells && _.contains(predictiveCells, i)) {
                    particles.colors[i].setHex(0xAA0000);
                }
                else {
                    particles.colors[i].setHex(0x222222);
                }
            }
        },

        updateProximalSynapses: function() {
            var proximalSynapses = this.proximalSynapses,
                showProximalSynapses = this.showProximalSynapses,
                inputDrawing = this.inputDrawing;

            if (showProximalSynapses && inputDrawing) {
                console.log(inputDrawing.getParticles().length);
                console.log(proximalSynapses);
            }
        },

        getParticles: function() {
            return this.particleSystem.geometry.vertices;
        }
    };
});
