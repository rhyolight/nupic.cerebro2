# Cerebro 2

A visualization and platform for NuPIC.

## Usage

Set up [cerebro2.server](https://github.com/chetan51/nupic.cerebro2.server) to export your model state.

Then, run:

    cd static
    python -m SimpleHTTPServer 8000

You can then visit the following URLs in your browser:

    // 3D Visualization
    http://localhost:8000

    // 2D Visualization
    http://localhost:8000/#visualizationClass=TwoDVisualization
