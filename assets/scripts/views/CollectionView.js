define(function (require) {
    'use strict';

    var EventEmitter = require('EventEmitter');


    function CollectionView ($element) {

        this.$element = $element;

        this.$collection = $element.find('[data-collection-role="collection"]');

        this.eventEmitter = new EventEmitter();

        this.views = [];

    }


    CollectionView.EVENT = {
        ADD: 'collection:add'
    };


    CollectionView.prototype.add = function (view) {
        this.views.push(view);
        this.$collection.append(view.$element);
        this.eventEmitter.trigger(CollectionView.EVENT.ADD, [ this, view ]);
        return this;
    };


    CollectionView.prototype.remove = function (view) {
        view.$element.remove();
        this.views.splice(this.views.indexOf(view), 1);
        return this;
    };


    return CollectionView;
});
