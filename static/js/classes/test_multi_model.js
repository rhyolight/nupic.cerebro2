var TestMultiModel = AbstractModel.extend(function() {
    return {
        run: function(input, callback) {
            var snapshot = generateRandomSnapshot(1, 50, 1, 25, 3, 10);
            callback(null, snapshot);
        },
    };
});
