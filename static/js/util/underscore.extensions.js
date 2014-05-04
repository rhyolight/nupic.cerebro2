// Determine if the array contains a given value
// Uses a cache to speed up computation
_.fastContains = function(obj, target, cache) {
    if (cache.data == undefined) {
        cache.data = {};
        for (var key in obj) {
            cache.data[obj[key]] = 1;
        }
    }
    return cache.data[target] == 1;
};
