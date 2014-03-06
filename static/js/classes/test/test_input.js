var TestInput = AbstractInput.extend(function(base) {
    return {
        init: function(numBits, min, max) {
            base.init.call(this);

            this.numBits = numBits;
            this.min = min;
            this.max = max;
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
