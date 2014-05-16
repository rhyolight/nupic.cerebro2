var CoordinateEncoderVisualization = EncoderVisualization.extend(function(base) {
    return {
        init: function(container, history, name) {
            this.name = name;

            this.region = null;

            base.init.call(this, container, history, name);
        },

        /* Public */

        loadData: function() {
            var region = this.getRegion();
            if (!region) return;

            var name = this.name;

            region.getNeighbors(function(error, neighbors) {
                console.clear();
                console.log("Encoder '" + name + "' neighbors:");
                console.log(JSON.stringify(neighbors));

                region.getTopWCoordinates(function(error, topWCoordinates) {
                    console.log("Encoder '" + name + "' topWCoordinates:");
                    console.log(JSON.stringify(topWCoordinates));
                });
            });
        },
    };
});
