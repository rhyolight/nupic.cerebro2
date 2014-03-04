var container = $('#container');

var history = new History();

var visualization = new ThreeDVisualization(container, history).setup();
visualization.render();

// Test dynamically adding snapshots to history
setInterval(function() {
	var x = Math.ceil(Math.random() * 50),
	    y = Math.ceil(Math.random() * 10),
	    z = Math.ceil(Math.random() * 50);

	var snapshot = new LocalSnapshot([x, y, z], [], []);
	history.addSnapshot(snapshot);
	visualization.historyUpdated();
}, 1000);
