var History = Fiber.extend(function() {
    return {
        init: function() {
            this.snapshots = [];
        },

        /* Public */

        addSnapshot: function(snapshot) {
            this.snapshots.push(snapshot);
        },

        getSnapshotAtIndex: function(i) {
            return this.snapshots[i];
        },

        length: function() {
            return this.snapshots.length;
        }
    };
});
