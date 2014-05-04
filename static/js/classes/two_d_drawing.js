var TwoDDrawing = AbstractDrawing.extend(function(base) {
    return {
        init: function(scene, originX, originY) {
            base.init.call(this, scene);

            this.originX = originX;
            this.originY = originY;
            this.originZ = 0;

            this.particleSystem = null;
        },

        setLayerDimensions: function(layerDimensions, reshape) {
            if (layerDimensions.length > 3) {
                throw new Error("TwoDVisualization only supports up to 3-dimensional layers");
            }

            while (layerDimensions.length < 3) {
                layerDimensions.push(1);
            }

            if (reshape) {
                layerDimensions = this.reshape3Dimensions(layerDimensions);
            }

            base.setLayerDimensions.call(this, layerDimensions);
        },

        /* Public */

        setup: function() {
            var paddingX = 15,
                paddingY = 15,
                dimensions = this.layerDimensions;

            if (dimensions.length != 3) {
                throw new Error("ThreeDVisualization only supports 3-dimensional layers");
            }

            var numX = dimensions[0],
                numY = dimensions[1],
                numZ = dimensions[2],
                originX = this.originX + (-(numX * paddingX) / 2),
                originY = this.originY + (-(numY * paddingY) / 2),
                originZ = this.originZ;

            var particles = new THREE.Geometry(),
                material = new THREE.ParticleBasicMaterial({
                    size: 30,
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
                    var pX = originX + x * paddingX,
                        pY = originY + y * paddingY,
                        pZ = originZ,
                        particle = new THREE.Vector3(pX, pY, pZ);

                    particles.vertices.push(particle);
                    particles.colors.push(new THREE.Color(COLOR_LIGHT_INACTIVE_CELL));
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
                predictedCells = this.predictedCells,
                showActiveColumns = this.showActiveColumns,
                showActiveCells = this.showActiveCells,
                showPredictedCells = this.showPredictedCells;

            var activeColumnsCache = {},
                activeCellsCache = {},
                predictedCellsCache = {};

            for (var i = 0; i < particles.vertices.length; i++) {
                var color = COLOR_LIGHT_INACTIVE_CELL;

                if (showActiveColumns && _.fastContains(activeColumns, i, activeColumnsCache)) {
                    color = COLOR_LIGHT_ACTIVE_COLUMN;
                }

                for (var j = 0; j < numZ; j++) {
                    var cell = i * numZ + j;

                    if (showActiveCells && _.fastContains(activeCells, cell, activeCellsCache)) {
                        color = COLOR_LIGHT_ACTIVE_CELL;
                    }
                    else if (showPredictedCells && _.fastContains(predictedCells, cell, predictedCellsCache)) {
                        color = COLOR_LIGHT_PREDICTED_CELL;
                    }
                }

                particles.colors[i].setHex(color);
            }
        }
    };
});
