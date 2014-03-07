var minX = intParam('minX') || 50,
    maxX = intParam('maxX') || 50,
    minY = intParam('minY') || 25,
    maxY = intParam('maxY') || 25,
    minZ = intParam('minZ') || 5,
    maxZ = intParam('maxZ') || 5,
    activeSparsity = intParam('activeSparsity') || 0.1,
    predictiveSparsity = intParam('predictiveSparsity') || 0.2,
    minProximal = intParam('minProximal') || 10,
    maxProximal = intParam('maxProximal') || 1000,
    snapshotClass = (strParam('snapshotClass') == "TestNetworkSnapshot") ? TestNetworkSnapshot : LocalSnapshot,
    loadRegionTimeoutDuration = intParam('loadRegionTimeoutDuration') || 0;

var container = $('#container');

var history = new History();
var model = new TestModel(minX, maxX, minY, maxY, minZ, maxZ, activeSparsity, predictiveSparsity, minProximal, maxProximal, snapshotClass);
var visualization = new ThreeDVisualization(container, history);

visualization.loadRegionTimeoutDuration = loadRegionTimeoutDuration;
visualization.render();

runFakeModel();


function runFakeModel() {
    setTimeout(function() {
        var input = new TestInput([7, 10], 5, 0, 100);

        model.run(input, function(error, snapshot) {
            history.addSnapshot(snapshot);
            visualization.historyUpdated();

            runFakeModel();
        });
    }, 1000);
}

function intParam(key) {
    return Number(strParam(key));
}

function strParam(key) {
    return $.url().fparam(key);
}
