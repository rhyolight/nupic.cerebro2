var CoordinateEncoderVisualization = EncoderVisualization.extend(function(base) {
    return {
        init: function(container, history, name) {
            this.name = name;
            base.init.call(this, container, history, name);

            this.coordinateDrawing = new CoordinateSystemDrawing();
            this._redraw();
        },

        /* Public */

        loadData: function() {
            var region = this.getRegion();
            if (!region) return;

            var self = this,
                name = this.name,
                coordinateDrawing = this.coordinateDrawing;

            region.getNeighbors(function(error, neighbors) {
                coordinateDrawing.setNeighbors(neighbors);

                region.getTopWCoordinates(function(error, topWCoordinates) {
                    coordinateDrawing.setTopWCoordinates(topWCoordinates);

                    self._redraw();
                });
            });
        },

        /* Private */

        _redraw: function() {
            var scene = this.scene,
                coordinateDrawing = this.coordinateDrawing;

            coordinateDrawing.clear();
            coordinateDrawing.setup();

            scene.add(coordinateDrawing.getObject3D());
        },
    };
});
