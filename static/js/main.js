var container = $('#container');

var history = new History();

var visualization = new ThreeDVisualization(container, history);
visualization.render();

// Test dynamically adding random snapshots to history
setInterval(function() {
    var snapshot = generateRandomSnapshot(1, 100, 1, 50, 3, 25);
    history.addSnapshot(snapshot);
    visualization.historyUpdated();
}, 1000);

/* Utilities */

function generateRandomSnapshot(minX, maxX, minY, maxY, minZ, maxZ) {
    var x = generateRandomValue(minX, maxX),
        y = generateRandomValue(minY, maxY),
        z = generateRandomValue(minZ, maxZ);

    return new TestNetworkSnapshot([x, y, z], [1, 2, 3], [4, 5, 6]);
}

function generateRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
