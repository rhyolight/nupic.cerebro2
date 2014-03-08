var TestLocalLayer = LocalLayer.extend(function(base) {
    return {
        init: function(minX, maxX, minY, maxY, minZ, maxZ, activeSparsity, predictiveSparsity, minProximal, maxProximal, inputLayer) {
            this._generate(minX, maxX, minY, maxY, minZ, maxZ, activeSparsity, predictiveSparsity, minProximal, maxProximal, inputLayer);

            var dimensions = this.dimensions,
                activeCells = this.activeCells,
                predictiveCells = this.predictiveCells,
                proximalSynapses = this.proximalSynapses;

            base.init.call(this, dimensions, activeCells, predictiveCells, proximalSynapses);
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
                    return _.random(total);
                }),
                predictiveCells = _(numPredictiveCells).times(function() {
                    return _.random(total);
                });

            this.dimensions = [x, y, z];
            this.activeCells = activeCells;
            this.predictiveCells = predictiveCells;

            this._connectToInputLayer(minProximal, maxProximal, inputLayer);
        },

        _connectToInputLayer: function(minProximal, maxProximal, inputLayer) {
            if (!inputLayer) return;

            var inputDimensions = inputLayer.getDimensions();

            if (inputDimensions.length != 3) {
                throw new Error("TestLocalLayer only supports 3-dimensional input layers");
            }

            var inputX = inputDimensions[0],
                inputY = inputDimensions[1],
                inputZ = inputDimensions[2],
                inputTotal = inputX * inputY * inputZ;

            var numProximal = _.random(Math.min(minProximal, inputTotal), Math.min(maxProximal, inputTotal)),
                proximalSynapses = _(numProximal).times(function() {
                    return _.random(100) / 100;
                });

            this.proximalSynapses = proximalSynapses;
        }
    };
});
