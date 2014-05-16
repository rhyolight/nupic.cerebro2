/* Main */

var loadDelay = intParam('loadDelay') || 0,
    modelURL = strParam('modelURL') || defaultModelURL();

var container3D = $('#container-3D'),
    container2D = $('#container-2D');

var model = new NetworkReadonlyModel(modelURL),
    history = new History(),
    visualization3D = new ThreeDCellVisualization(container3D, history),
    visualization2D = new TwoDCellVisualization(container2D, history);

visualization3D.loadDelay = loadDelay;
visualization3D.render();

visualization2D.loadDelay = loadDelay;
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
