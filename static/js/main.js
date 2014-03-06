var container = $('#container');

var history = new History();
var model = new TestModel(1, 50, 1, 25, 3, 5, 0.1, 0.2, TestNetworkSnapshot);
var visualization = new ThreeDVisualization(container, history);

// Uncomment to speed up loading of regions
// visualization.loadRegionTimeoutDuration = 0;

visualization.render();

// Test dynamically adding random snapshots to history
runModel();


function runModel() {
    setTimeout(function() {
        var input = new TestInput(5, 0, 100);

        model.run(input, function(error, snapshot) {
            history.addSnapshot(snapshot);
            visualization.historyUpdated();

            runModel();
        });
    }, 1000);
}
