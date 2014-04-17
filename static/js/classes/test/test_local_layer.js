var TestLocalLayer = LocalLayer.extend(function(base) {
    return {
        init: function(minX, maxX, minY, maxY, minZ, maxZ, activeSparsity, predictiveSparsity, minProximal, maxProximal, inputLayer) {
            this._generate(minX, maxX, minY, maxY, minZ, maxZ, activeSparsity, predictiveSparsity, minProximal, maxProximal, inputLayer);

            var dimensions = this.dimensions,
                activeColumns = this.activeColumns,
                activeCells = this.activeCells,
                predictiveCells = this.predictiveCells,
                proximalSynapses = this.proximalSynapses;

            base.init.call(this, dimensions, activeColumns, activeCells, predictiveCells, proximalSynapses);
        },

        /* Private */

        _generate: function(minX, maxX, minY, maxY, minZ, maxZ, activeSparsity, predictiveSparsity, minProximal, maxProximal, inputLayer) {
            var x = _.random(minX, maxX),
                y = _.random(minY, maxY),
                z = _.random(minZ, maxZ),
                total = x * y * z;

            var numActiveCells = _.random(1, total * activeSparsity),
                numPredictiveCells = _.random(1, total * predictiveSparsity);

            var activeCells = _(numActiveCells).times(function() {
                    return _.random(total - 1);
                }),
                predictiveCells = _(numPredictiveCells).times(function() {
                    return _.random(total - 1);
                });

            this.dimensions = [x, y, z];
            this.activeCells = activeCells;
            this.predictiveCells = predictiveCells;

            this._connectToInputLayer(minProximal, maxProximal, inputLayer);
        },

        _connectToInputLayer: function(minProximal, maxProximal, inputLayer) {
            if (!inputLayer) return;

            var inputDimensions = inputLayer.getDimensions(),
                dimensions = this.dimensions;

            if (inputDimensions.length != 3 || dimensions.length != 3) {
                throw new Error("TestLocalLayer only supports 3-dimensional input layers");
            }

            var inputTotal = inputDimensions[0] * inputDimensions[1] * inputDimensions[2],
                total = dimensions[0] * dimensions[1] * dimensions[2];

            var numProximal = _.random(Math.min(minProximal, inputTotal), Math.min(maxProximal, inputTotal)),
                proximalSynapses = _(numProximal).times(function() {
                    return [_.random(total - 1), _.random(inputTotal - 1), _.random(100) / 100];
                });

            this.proximalSynapses = proximalSynapses;
        }
    };
});
