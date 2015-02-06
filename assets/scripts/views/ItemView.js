define(function (require) {
    'use strict';

    var $ = require('jquery');
    var EventEmitter = require('EventEmitter');
    var Handlebars = require('Handlebars');
    var itemTemplate = require('text!templates/itemTemplate.html');


    function ItemView ($element, model) {

        this.$element = ($element !== undefined) ? $element : $(document.createElement('tr'));

        this.model = model;

        this.$checkbox = $();

        this.$remove = $();

        this.eventEmitter = new EventEmitter();

        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.handleRemoveClick = this.handleRemoveClick.bind(this);

        this.init();
    }


    ItemView.EVENT = {
        REMOVE_REQUEST: 'itemView:removeRequest'
    };

    ItemView.template = Handlebars.compile(itemTemplate);


    ItemView.prototype.init = function () {
        this.render();
    };


    ItemView.prototype.render = function () {
        this.disable();
        this.$element.empty();
        this.$element.html(ItemView.template(this.model));
        this.updateDOMProperties();
        this.enable();
        return this;
    };


    ItemView.prototype.updateDOMProperties = function () {
        this.$checkbox = this.$element.find('[data-item-role="checkbox"]');
        this.$remove = this.$element.find('[data-item-role="remove"]');
        return this;
    };


    ItemView.prototype.enable = function () {
        this.$checkbox.on('change', this.handleCheckboxChange);
        this.$remove.on('click', this.handleRemoveClick);
        return this;
    };


    ItemView.prototype.disable = function () {
        this.$checkbox.off('change', this.handleCheckboxChange);
        this.$remove.off('click', this.handleRemoveClick);
        return this;
    };


    ItemView.prototype.handleCheckboxChange = function (e) {
        this.eventEmitter.trigger(ItemView.EVENT.TOGGLE_REQUEST, [ this, e.target.checked ]);
    };


    ItemView.prototype.handleRemoveClick = function () {
        this.eventEmitter.trigger(ItemView.EVENT.REMOVE_REQUEST, [ this ]);
    };


    return ItemView;
});
