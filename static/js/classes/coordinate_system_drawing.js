var CoordinateSystemDrawing = AbstractDrawing.extend(function(base) {
    return {
        init: function() {
            base.init.call(this);

            this.particleSystem = null;

            this.neighbors = null;
            this.topWCoordinates = null;
        },

        /* Public */

        setNeighbors: function(neighbors) {
            this.neighbors = neighbors;
        },

        setTopWCoordinates: function(topWCoordinates) {
            this.topWCoordinates = topWCoordinates;
        },

        setup: function() {
            var object3D = this.getObject3D(),
                axes = this._buildAxes(1000)
                particleSystem = this._buildParticleSystem();

            object3D.add(axes);

            if (particleSystem) {
                object3D.add(particleSystem);
                this.particleSystem = particleSystem;
            }
        },

        reset: function() {
            base.reset.call(this);

            this.neighbors = null;
            this.topWCoordinates = null;
        },

        clear: function() {
            if (!this.particleSystem) return;

            var object3D = this.getObject3D(),
                particleSystem = this.particleSystem;

            object3D.remove(particleSystem);
            this.particleSystem = null;
        },

        updateParticles: function() {
            if (!this.particleSystem) return;
            if (!this.topWCoordinates) return;

            var particles = this.particleSystem.geometry,
                neighbors = this.neighbors,
                topWCoordinates = this.topWCoordinates;
            
            for (var i = 0; i < particles.vertices.length; i++) {
                var coordinate = neighbors[i];

                var color = COLOR_DARK_ACTIVE_CELL,
                    topWCoordinatesCache = {};

                if (_.fastContains(topWCoordinates, coordinate, topWCoordinatesCache)) {
                    color = COLOR_DARK_PREDICTED_CELL;
                }

                particles.colors[i].setHex(color);
            }
        },

        updateProximalSynapses: function() {
            if (!this.particleSystem) return;

            var inputDrawing = this.inputDrawing,
                particles = this.particleSystem.geometry.vertices,
                inputParticles = inputDrawing.getParticles(),
                proximalSynapses = this.proximalSynapses,
                showProximalSynapses = this.showProximalSynapses;
        },

        /* Private */

        _buildParticleSystem: function() {
            if (!this.neighbors) return null;

            var neighbors = this.neighbors;

            var particles = new THREE.Geometry(),
                material = new THREE.ParticleBasicMaterial({
                    size: 1,
                    map: THREE.ImageUtils.loadTexture(
                        "img/particle.png"
                    ),
                    blending: THREE.NormalBlending,
                    transparent: true,
                    vertexColors: true
                }),
                particleSystem = new THREE.ParticleSystem(particles, material);

            particleSystem.sortParticles = true;

            for (var i = 0; i < neighbors.length; i++) {
                var neighbor = neighbors[i],
                    pX = neighbor[0],
                    pY = neighbor[1] || 0,
                    pZ = neighbor[2] || 0,
                    particle = new THREE.Vector3(pX, pY, pZ);

                    particles.vertices.push(particle);
                    particles.colors.push(new THREE.Color(COLOR_DARK_ACTIVE_CELL));
            }

            return particleSystem;
        },

        /* From https://github.com/sole/three.js-tutorials/blob/master/drawing_the_axes/main.js */

        _buildAxes: function(length) {
            var axes = new THREE.Object3D();

            axes.add( this._buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0xFF0000, false ) ); // +X
            axes.add( this._buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -length, 0, 0 ), 0xFF0000, true) ); // -X
            axes.add( this._buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00FF00, false ) ); // +Y
            axes.add( this._buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x00FF00, true ) ); // -Y
            axes.add( this._buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000FF, false ) ); // +Z
            axes.add( this._buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -length ), 0x0000FF, true ) ); // -Z

            return axes;
        },

        _buildAxis: function(src, dst, colorHex, dashed) {
            var geom = new THREE.Geometry(),
                mat; 

            if(dashed) {
                mat = new THREE.LineDashedMaterial({
                    linewidth: 3,
                    color: colorHex,
                    dashSize: 3,
                    gapSize: 3
                });
            } else {
                mat = new THREE.LineBasicMaterial({
                    linewidth: 3,
                    color: colorHex
                });
            }

            geom.vertices.push( src.clone() );
            geom.vertices.push( dst.clone() );
            geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

            var axis = new THREE.Line( geom, mat, THREE.LinePieces );

            return axis;
        },
    };
});
