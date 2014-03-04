var ThreeDVisualization = Visualization.extend(function(base) {
	return {
		init: function(container) {
			base.init(container);

			this.numX = 50;
			this.numY = 8;
			this.numZ = 50;
			this.particleSystem = null;

			this._setupGUI();
		},

		/* Public */

		setupCells: function() {
			var padding = 50,
				numX = this.numX,
				numY = this.numY,
				numZ = this.numZ,
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

			if (this.particleSystem) this.scene.remove(this.particleSystem);
			this.scene.add(particleSystem);

			this.particleSystem = particleSystem;
		},

		/* Private */

		_setupGUI: function() {
			var gui = this.gui;

			var update = _.bind(function() {
				this.setupCells();
			}, this);

			gui.add(this, 'numX', 1, 100).step(1).onChange(update);
			gui.add(this, 'numY', 1, 100).step(1).onChange(update);
			gui.add(this, 'numZ', 1, 100).step(1).onChange(update);
		}
	};
});
