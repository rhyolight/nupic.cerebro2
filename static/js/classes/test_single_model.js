var TestSingleModel = AbstractModel.extend(function(base) {
    return {
        init: function() {
            base.init();

            this.snapshot = generateRandomSnapshot(1, 50, 1, 25, 3, 10); 
        },

        run: function(input, callback) {
            var snapshot = this.snapshot;

            callback(null, snapshot);
        },
    };
});
