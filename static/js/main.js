/* Main */

var params = {
        minX: intParam('minX') || 50,
        maxX: intParam('maxX') || 50,
        minY: intParam('minY') || 25,
        maxY: intParam('maxY') || 25,
        minZ: intParam('minZ') || 5,
        maxZ: intParam('maxZ') || 5,
        columnSparsity: intParam('columnSparsity') || 0.1,
        activeSparsity: intParam('activeSparsity') || 0.1,
        predictiveSparsity: intParam('predictiveSparsity') || 0.2,
        minProximal: intParam('minProximal') || 10,
        maxProximal: intParam('maxProximal') || 1000
    },
    layerClass = (strParam('layerClass') == "TestNetworkLayer") ? TestNetworkLayer : TestLocalLayer,
    loadLayersTimeoutDuration = intParam('loadLayersTimeoutDuration') || 0;

var container = $('#container');

var history = new History();
var model = new TestModel();
var visualization = new ThreeDVisualization(container, history);

visualization.loadLayersTimeoutDuration = loadLayersTimeoutDuration;
visualization.render();

initFakeData();
runModel();

/* Functions */

function initFakeData() {
    for (var i = 0; i < 25; i++) {
        var inputLayer  = new layerClass(params, null);
            outputLayer = new layerClass(params, inputLayer);

        model.pushInputLayer(inputLayer);
        model.pushOutputLayer(outputLayer);
    }
}

function runModel() {
    setTimeout(function() {
        model.getNextSnapshot(function(error, snapshot) {
            if (snapshot) {
                history.addSnapshot(snapshot);
                visualization.historyUpdated();
            }

            runModel();
        });
    }, 1000);
}

/* Utilities */

function intParam(key) {
    return Number(strParam(key));
}

function strParam(key) {
    return $.url().fparam(key);
}
