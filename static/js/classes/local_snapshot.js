var LocalSnapshot = AbstractSnapshot.extend(function() {
	return {
		init: function(modelDimensions, activeCells, predictiveCells) {
			this.modelDimensions = modelDimensions;
			this.activeCells = activeCells;
			this.predictiveCells = predictiveCells;
		},

		/* Public */
		
		getModelDimensions: function() {
			return _.clone(this.modelDimensions);
		},

		getActiveCells: function() {
			return _.clone(this.activeCells);
		},

		getPredictiveCells: function() {
			return _.clone(this.predictiveCells);
		}
	};
});
