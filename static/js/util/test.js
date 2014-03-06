function generateRandomSnapshot(minX, maxX, minY, maxY, minZ, maxZ) {
    var activeSparsity = 0.1,
        predictiveSparsity = 0.3;

    var x = generateRandomInt(minX, maxX),
        y = generateRandomInt(minY, maxY),
        z = generateRandomInt(minZ, maxZ),
        total = x * y * z;

    var numActiveCells = generateRandomInt(1, total * activeSparsity),
        numPredictiveCells = generateRandomInt(1, total * predictiveSparsity),
        activeCells = [],
        predictiveCells = [];

    for (var i = 0; i < total; i++) {
        if (i < numActiveCells) activeCells.push(generateRandomInt(0, total));
        if (i < numPredictiveCells) predictiveCells.push(generateRandomInt(0, total));
    }

    return new TestNetworkSnapshot([x, y, z], activeCells, predictiveCells);
}

function generateRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
