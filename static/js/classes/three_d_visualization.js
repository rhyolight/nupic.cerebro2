var ThreeDVisualization = Visualization.extend(function(base) {
	return {
		init: function(container) {
			base.init(container);

			this.particleSystem = null;
		},

		/* Public */

		setupCells: function(numX, numY, numZ) {
			var padding = 10,
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
			    });

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

			var particleSystem = new THREE.ParticleSystem(particles, material);
		    particleSystem.sortParticles = true;

			this.scene.add(particleSystem);
		}
	};
});
