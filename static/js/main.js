var container = $('#container');

var history = new History();
var model = new TestSingleModel();
var visualization = new ThreeDVisualization(container, history);

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
