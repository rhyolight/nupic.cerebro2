function generateRandomSnapshot(minX, maxX, minY, maxY, minZ, maxZ) {
    var activeSparsity = 0.1,
        predictiveSparsity = 0.3;

    var x = generateRandomInt(minX, maxX),
        y = generateRandomInt(minY, maxY),
        z = generateRandomInt(minZ, maxZ),
        total = x * y * z;

    var activeCells = generateRandomArrayOfInts(1, total * activeSparsity, 0, total),
        predictiveCells = generateRandomArrayOfInts(1, total * predictiveSparsity, 0, total);

    return new TestNetworkSnapshot([x, y, z], activeCells, predictiveCells);
}

function generateRandomArrayOfInts(minN, maxN, minVal, maxVal) {
    var num = generateRandomInt(minN, maxN),
        ints = [];

    for (var i = 0; i < num; i++) {
        ints.push(generateRandomInt(minVal, maxVal));
    }

    return ints;
}

function generateRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
