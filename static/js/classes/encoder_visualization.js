var EncoderVisualization = AbstractVisualization.extend(function(base) {
    return {
        init: function(container, history, name) {
            this.name = name;

            this.region = null;

            base.init.call(this, container, history);
        },

        /* Public */
        iterationChanged: function(currentSnapshot, lastSnapshot) {
            var name = this.name,
                snapshot = currentSnapshot,
                region = snapshot.getEncoderRegion(name);

            if (region) {
                this.region = region;
                this._load();
            }
        },

        /* Private */

        _load: function() {
            var region = this.region,
                name = this.name;

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
