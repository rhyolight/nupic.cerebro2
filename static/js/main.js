/* Main */

var loadLayersTimeoutDuration = intParam('loadLayersTimeoutDuration') || 0,
    modelURL = strParam('modelURL') || defaultModelURL();

var container3D = $('#container-3D'),
    container2D = $('#container-2D');

var model = new NetworkReadonlyModel(modelURL),
    history = new History(),
    visualization3D = new ThreeDVisualization(container3D, history),
    visualization2D = new TwoDVisualization(container2D, history);

visualization3D.loadLayersTimeoutDuration = loadLayersTimeoutDuration;
visualization3D.render();

visualization2D.loadLayersTimeoutDuration = loadLayersTimeoutDuration;
visualization2D.render();

var sync = new GUISync(visualization3D);
sync.addChild(visualization2D);

runModel();

/* Functions */

function runModel() {
    model.getNextSnapshot(function(error, snapshot) {
        var delay = 1000;

        if (snapshot) {
            history.addSnapshot(snapshot);
            visualization3D.historyUpdated();
            visualization2D.historyUpdated();

            delay = 0;
        }

        setTimeout(function() {
            runModel();
        }, delay);
    });
}

/* Utilities */

function intParam(key) {
    return Number(strParam(key));
}

function strParam(key) {
    return $.url().fparam(key);
}

function defaultModelURL() {
    return "http://" + window.location.hostname + ":9090/_model";
}
