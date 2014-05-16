var CoordinateEncoderVisualization = EncoderVisualization.extend(function(base) {
    return {
        init: function(container, history, name) {
            this.name = name;

            this.region = null;

            base.init.call(this, container, history, name);
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

            region.getNeighbors(function(error, neighbors) {
                console.clear();
                console.log("Encoder '" + name + "' neighbors:");
                console.log(JSON.stringify(neighbors));

                region.getTopWCoordinates(function(error, topWCoordinates) {
                    console.log("Encoder '" + name + "' topWCoordinates:");
                    console.log(JSON.stringify(topWCoordinates));
                });
            });
        }
    };
});
