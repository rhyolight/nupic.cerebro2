var TwoDCellDrawing = CellDrawing.extend(function(base) {
    return {
        init: function() {
            base.init.call(this);

            this.particleSystem = null;
        },

        setRegionDimensions: function(regionDimensions, reshape) {
            if (regionDimensions.length > 3) {
                throw new Error("TwoDVisualization only supports up to 3-dimensional layers");
            }

            while (regionDimensions.length < 3) {
                regionDimensions.push(1);
            }

            if (reshape) {
                regionDimensions = this.reshape3Dimensions(regionDimensions);
            }

            base.setRegionDimensions.call(this, regionDimensions);
        },

        /* Public */

        setup: function() {
            var paddingX = 15,
                paddingY = 15,
                dimensions = this.regionDimensions;

            if (dimensions.length != 3) {
                throw new Error("ThreeDVisualization only supports 3-dimensional layers");
            }

            var numX = dimensions[0],
                numY = dimensions[1],
                numZ = dimensions[2],
                originX = -(numX * paddingX) / 2,
                originY = -(numY * paddingY) / 2,
                originZ = 0;

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

            this.object3D.add(particleSystem);

            this.particleSystem = particleSystem;
        },

        getSize: function() {
            var particleSystem = this.particleSystem,
                geometry = particleSystem.geometry;

            geometry.computeBoundingBox();

            var min = geometry.boundingBox.min,
                max = geometry.boundingBox.max,
                size = new THREE.Vector3().subVectors(max, min);

            return size;
        },

        clear: function() {
            if (!this.particleSystem) return;

            this.object3D.remove(this.particleSystem);
        },

        updateCells: function() {
            if (!this.particleSystem) return;

            var dimensions = this.regionDimensions,
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
