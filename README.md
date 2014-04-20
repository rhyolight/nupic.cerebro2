# Cerebro 2

A visualization and debugging tool for NuPIC.

## Usage

    cd static
    python -m SimpleHTTPServer 8000

You can the visit the following URLs in your browser:

    // Basic demo
    http://localhost:8000

    // Random models demo
    http://localhost:8000/#modelClass=TestModel&minX=1&maxX=50&minY=1&maxY=25&minZ=3&maxZ=5

    // Network demo
    http://localhost:8000/#modelClass=TestModel&layerClass=TestNetworkLayer&loadLayersTimeoutDuration=500

## Todo

* Fix bug with manually typing in iteration number in the control box
* Keep updating the number of iterations for network readonly models
* Show the active synapses in a different color
