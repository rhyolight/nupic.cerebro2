/* Keeps Visualizations in sync */
var GUISync = Fiber.extend(function() {
    return {
        init: function(master) {
            this.master = master;
            this.children = [];

            this._listenForEvents();
        },

        addChild: function(child) {
            this.children.push(child);
            this._hideControllers(child);
        },

        /* Private */

        _listenForEvents: function() {
            var self = this;

            var fn = _.bind(this.master.iterationChanged, this.master),
                newFn = function (currentSnapshot, lastSnapshot) {
                    fn(currentSnapshot, lastSnapshot);
                    self._iterationChanged(currentSnapshot, lastSnapshot);
                }

            this.master.iterationChanged = newFn;
        },

        _hideControllers: function(child) {
            child._hideController('iteration');
            child._hideController('play');
            child._hideController('speed');
            child._hideController('next');
            child._hideController('prev');
        },

        _iterationChanged: function() {
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].iteration = this.master.iteration;
            }
        },
    };
});
