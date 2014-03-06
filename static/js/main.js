var container = $('#container');

var history = new History();

var visualization = new ThreeDVisualization(container, history);
visualization.render();

// Test dynamically adding snapshots to history
setInterval(function() {
    var x = Math.ceil(Math.random() * 50),
        y = Math.ceil(Math.random() * 10),
        z = Math.ceil(Math.random() * 47) + 3;

    var snapshot = new TestNetworkSnapshot([x, y, z], [1, 2, 3], [4, 5, 6]);
    history.addSnapshot(snapshot);
    visualization.historyUpdated();
}, 1000);
