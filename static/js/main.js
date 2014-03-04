var container = $('#container');

var visualization = new ThreeDVisualization(container);
visualization.setupCells(50, 8, 50);
visualization.render();
