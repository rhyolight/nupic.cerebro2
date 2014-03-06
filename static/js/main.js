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
