var TestInput = AbstractInput.extend(function(base) {
    return {
        init: function(dimensions, numBits, min, max) {
            base.init.call(this, dimensions);

            this.numBits = numBits;
            this.min = min;
            this.max = max;
        },

        getDimensions: function() {
            return this.dimensions;
        },

        getBits: function(callback) {
            var numBits = this.numBits,
                min = this.min,
                max = this.max;

            var bits = _(numBits).times(function() {
                _.random(min, max);
            });

            callback(null, bits);
        },
    };
});
