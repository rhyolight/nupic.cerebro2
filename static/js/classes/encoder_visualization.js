var EncoderVisualization = AbstractVisualization.extend(function(base) {
    return {
        init: function(container, history, name) {
            this.name = name;

            this.region = null;

            base.init.call(this, container, history);
        },

        /* Public */

        getRegion: function() {
            var name = this.name,
                snapshot = this.snapshot;

            return snapshot.getEncoderRegion(name);
        },

        loadData: function() {
            var region = this.getRegion();
            if (!region) return;

            var name = this.name;

            region.getInput(function(error, input) {
                console.clear();
                console.log("Encoder '" + name + "' input:");
                console.log(JSON.stringify(input));

                region.getOutput(function(error, output) {
                    console.log("Encoder '" + name + "' output:");
                    console.log(JSON.stringify(output));
                });
            });
        }
    };
});
