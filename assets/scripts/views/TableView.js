define(function (require) {
    'use strict';

    // Libs and helpers
    var $ = require('jquery');
    var EventEmitter = require('EventEmitter');
    var Handlebars = require('Handlebars');
    var template = require('text!templates/tableTemplate.html');

    // Models
    var TaskModel = require('models/TaskModel');


    function TableView ($element) {

        this.$element = $element;

        this.$removeButton = TableView.$empty;

        this.$checkbox = TableView.$empty;

        this.eventEmitter = new EventEmitter();

        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.handleRemoveButtonClick = this.handleRemoveButtonClick.bind(this);
    }


    TableView.$empty = $();

    TableView.template = Handlebars.compile(template);

    TableView.DATA_ATTRIBUTE = {
        TASK_ID: 'table-task-id'
    };

    TableView.EVENT = {
        TASK_CHECKED_TOGGLE: 'TableView:taskCompleteToggle',
        TASK_REMOVE_CLICK: 'TableView:taskRemoveClick'
    };


    TableView.prototype.updateDOMProperties = function () {
        this.$removeButton = this.$element.find('[data-table-role="removeButton"]');
        this.$checkbox = this.$element.find('[data-table-role="checkbox"]');
        return this;
    };


    TableView.prototype.enable = function () {
        this.$removeButton.on('click', this.handleRemoveButtonClick);
        this.$checkbox.on('change', this.handleCheckboxChange);
        return this;
    };

    TableView.prototype.disable = function () {
        this.$removeButton.off('click', this.handleRemoveButtonClick);
        this.$checkbox.off('change', this.handleCheckboxChange);
        return this;
    };


    TableView.prototype.render = function (taskModels) {
        var templateData = {
            taskModels: taskModels,
            incompleteCount: taskModels.length - taskModels.filter(TaskModel.isCompleteEvaluator).length
        };
        this.disable();
        this.$element.empty();
        this.$element.html(TableView.template(templateData));
        this.updateDOMProperties();
        this.enable();
        return this;
    };


    TableView.prototype.handleCheckboxChange = function (e) {
        debugger;
        var taskId = $(e.currentTarget).data(TableView.DATA_ATTRIBUTE.TASK_ID);
        var isChecked = e.currentTarget.checked;
        this.eventEmitter.trigger(TableView.EVENT.TASK_CHECKED_TOGGLE, [ taskId, isChecked ]);
    };


    TableView.prototype.handleRemoveButtonClick = function (e) {
        var taskId = $(e.currentTarget).data(TableView.DATA_ATTRIBUTE.TASK_ID);
        this.eventEmitter.trigger(TableView.EVENT.TASK_REMOVE_CLICK, [ taskId ]);
    };


    return TableView;
});
