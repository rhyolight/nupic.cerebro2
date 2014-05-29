/* Main */

var loadDelay = intParam('loadDelay') || 0,
    modelURL = strParam('modelURL') || defaultModelURL();

var container = $('#container');

var model = new NetworkReadonlyModel(modelURL),
    history = new History(),
    visualization = new CoordinateEncoderVisualization(container, history, "coordinate");

visualization.loadDelay = loadDelay;
visualization.render();

runModel();

/* Functions */

function runModel() {
    model.getNextSnapshot(function(error, snapshot) {
        var delay = 1000;

        if (snapshot) {
            history.addSnapshot(snapshot);
            visualization.historyUpdated();

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
