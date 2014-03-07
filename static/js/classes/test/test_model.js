var TestModel = AbstractModel.extend(function(base) {
    return {
        init: function(minX, maxX, minY, maxY, minZ, maxZ, activeSparsity, predictiveSparsity, minProximal, maxProximal, snapshotClass) {
            base.init.call(this);

            this.minX = minX;
            this.maxX = maxX;
            this.minY = minY;
            this.maxY = maxY;
            this.minZ = minZ;
            this.maxZ = maxZ;
            this.activeSparsity = activeSparsity;
            this.predictiveSparsity = predictiveSparsity;
            this.minProximal = minProximal;
            this.maxProximal = maxProximal;
            this.snapshotClass = snapshotClass;
        },

        /* Public */

        run: function(input, callback) {
            var snapshot = this._generateSnapshot();
            callback(null, snapshot);
        },

        /* Private */

        _generateSnapshot: function() {
            var minX = this.minX,
                maxX = this.maxX,
                minY = this.minY,
                maxY = this.maxY,
                minZ = this.minZ,
                maxZ = this.maxZ,
                activeSparsity = this.activeSparsity,
                predictiveSparsity = this.predictiveSparsity,
                minProximal = this.minProximal,
                maxProximal = this.maxProximal,
                snapshotClass = this.snapshotClass;

            var x = _.random(minX, maxX),
                y = _.random(minY, maxY),
                z = _.random(minZ, maxZ),
                total = x * y * z;

            var numActiveCells = _.random(1, total * activeSparsity),
                numPredictiveCells = _.random(1, total * predictiveSparsity),
                numProximal = _.random(minProximal, Math.min(maxProximal, total));

            var activeCells = _(numActiveCells).times(function() {
                    return _.random(total);
                }),
                predictiveCells = _(numPredictiveCells).times(function() {
                    return _.random(total);
                }),
                proximalSynapses = _(numProximal).times(function() {
                    return _.random(100) / 100;
                });

            return new snapshotClass([x, y, z], activeCells, predictiveCells, proximalSynapses);
        }
    };
});
