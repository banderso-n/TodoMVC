define(function (require) {
    'use strict';

    var deparam = require('jquery-deparam');
    var EventEmitter = require('EventEmitter');


    function FormView ($element) {

        this.$element = $element;

        this.eventEmitter = new EventEmitter();

        this.handleSubmit = this.handleSubmit.bind(this);

        this.init();
    };


    FormView.EVENT = {
        SUBMIT: 'formView:submit'
    };


    FormView.prototype.init = function () {
        this.enable();
    };


    FormView.prototype.enable = function () {
        this.$element.on('submit', this.handleSubmit);
        return this;
    };


    FormView.prototype.reset = function () {
        this.$element.get(0).reset();
        return this;
    };


    FormView.prototype.submit = function () {
        this.eventEmitter.trigger(FormView.EVENT.SUBMIT, [ this, deparam(this.$element.serialize()) ]);
        return this;
    };


    FormView.prototype.handleSubmit = function (e) {
        e.preventDefault();
        this.submit();
    };


    return FormView;
});
