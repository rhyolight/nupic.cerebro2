var ThreeDVisualization = Visualization.extend(function(base) {
	return {
		init: function(container) {
			base.init(container);

			this._setupGUI();
			this._addParticles();
		},

		/* Private */

		_setupGUI: function() {
			var gui = this.gui;

			gui.add(this.camera.position, 'x', -100, 100);
			gui.add(this.camera.position, 'y', -100, 100);
			gui.add(this.camera.position, 'z', 0, 600);
		},

		_addParticles: function() {
			var particleCount = 10000,
			    particles = new THREE.Geometry(),
			    pMaterial = new THREE.ParticleBasicMaterial({
			      color: 0xFFFFFF,
			      size: 20,
			      map: THREE.ImageUtils.loadTexture(
				    "img/particle.png"
				  ),
				  blending: THREE.AdditiveBlending,
				  transparent: true
			    });

			for (var p = 0; p < particleCount; p++) {
				var pX = Math.random() * 500 - 250,
				    pY = Math.random() * 500 - 250,
				    pZ = Math.random() * 500 - 250,
				    particle = new THREE.Vector3(pX, pY, pZ);

				particles.vertices.push(particle);
			}

			var particleSystem = new THREE.ParticleSystem(particles, pMaterial);
		    particleSystem.sortParticles = true;

			this.scene.add(particleSystem);
		}
	};
});
