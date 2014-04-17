var ThreeDDrawing = AbstractDrawing.extend(function(base) {
    return {
        init: function(scene, originX, originY, originZ) {
            base.init.call(this, scene);

            this.originX = originX;
            this.originY = originY;
            this.originZ = originZ;

            this.particleSystem = null;
            this.proximalLines = null;
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

            var dimensions = this.layerDimensions,
                numZ = dimensions[2],
                particles = this.particleSystem.geometry,
                activeColumns = this.activeColumns,
                activeCells = this.activeCells,
                predictiveCells = this.predictiveCells,
                showActiveColumns = this.showActiveColumns,
                showActiveCells = this.showActiveCells,
                showPredictiveCells = this.showPredictiveCells;

            for (var i = 0; i < particles.vertices.length; i++) {
                var column = Math.floor(i / numZ);

                if (showActiveCells && _.contains(activeCells, i)) {
                    particles.colors[i].setHex(0x006400);
                }
                else if (showPredictiveCells && _.contains(predictiveCells, i)) {
                    particles.colors[i].setHex(0xAA0000);
                }
                else if (showActiveColumns && _.contains(activeColumns, column)) {
                    particles.colors[i].setHex(0xFFFFFF);
                }
                else {
                    particles.colors[i].setHex(0x222222);
                }
            }
        },

        updateProximalSynapses: function() {
            if (!this.particleSystem) return;

            var inputDrawing = this.inputDrawing,
                particles = this.particleSystem.geometry.vertices,
                inputParticles = inputDrawing.getParticles(),
                proximalSynapses = this.proximalSynapses,
                showProximalSynapses = this.showProximalSynapses;

            if (this.proximalLines) this.scene.remove(this.proximalLines);
                
            if (showProximalSynapses && inputDrawing) {
                var geometry = new THREE.Geometry(),
                    material = new THREE.LineBasicMaterial({vertexColors: THREE.VertexColors});

                for (var i = 0; i < proximalSynapses.length; i++) {
                    var synapse = proximalSynapses[i],
                        toIndex = synapse[0],
                        fromIndex = synapse[1],
                        permanence = synapse[2],
                        toParticle = particles[toIndex],
                        fromParticle = inputParticles[fromIndex],
                        toColor = new THREE.Color(0x0000FF).multiplyScalar(permanence),
                        fromColor = new THREE.Color(0xFF0000).multiplyScalar(permanence);

                    geometry.vertices.push(toParticle);
                    geometry.vertices.push(fromParticle);

                    geometry.colors.push(toColor);
                    geometry.colors.push(fromColor);
                }

                var line = new THREE.Line(geometry, material, THREE.LinePieces);

                this.scene.add(line);

                this.proximalLines = line;
            }
        },

        getParticles: function() {
            return this.particleSystem.geometry.vertices;
        }
    };
});
