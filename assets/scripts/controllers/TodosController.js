define(function (require) {
    'use strict';

    // Third party libs and polyfills
    require('polyfills/Array.prototype.find');
    var $ = require('jquery');

    // Views
    var AnalyticsView = require('views/AnalyticsView');
    var FormView = require('views/FormView');
    var TableView = require('views/TableView');


    function TodosController (taskRepository) {

        this.taskRepository = taskRepository;

        this.analyticsView = null;

        this.tableView = null;

        this.taskInputFormView = null;

        this.taskModels = taskRepository.getAll();

        this.handleTaskRemoveClick = this.handleTaskRemoveClick.bind(this);
        this.handleTaskCheckedToggle = this.handleTaskCheckedToggle.bind(this);
        this.handleTaskInputFormViewSubmit = this.handleTaskInputFormViewSubmit.bind(this);

        this.init();
    }


    TodosController.prototype.init = function () {
        var $analyticsView = $('#js-analyticsView');
        if ($analyticsView.length !== 0) {
            this._initializeAnalyticsView($analyticsView);
        }

        var $tableView = $('#js-tableView');
        if ($tableView.length !== 0) {
            this._initializeTableView($tableView);
        }

        var $taskInputFormView = $('#js-taskInputFormView');
        if ($taskInputFormView.length !== 0) {
            this._initializeTaskInputFormView($taskInputFormView);
        }
    };


    TodosController.prototype._initializeAnalyticsView = function ($element) {
        this.analyticsView = new AnalyticsView($element);
        this.analyticsView.render(this.taskModels);
    };


    TodosController.prototype._initializeTableView = function ($element) {
        this.tableView = new TableView($element);
        this.tableView.render(this.taskModels);
        this.tableView.eventEmitter.on(TableView.EVENT.TASK_CHECKED_TOGGLE, this.handleTaskCheckedToggle);
        this.tableView.eventEmitter.on(TableView.EVENT.TASK_REMOVE_CLICK, this.handleTaskRemoveClick);
    };


    TodosController.prototype.updateViews = function () {
        this.tableView.render(this.taskModels);
        this.analyticsView.render(this.taskModels);
    };


    TodosController.prototype._initializeTaskInputFormView = function ($element) {
        this.taskInputFormView = new FormView($element);
        this.taskInputFormView.eventEmitter.on(FormView.EVENT.SUBMIT, this.handleTaskInputFormViewSubmit);
    };


    TodosController.prototype.handleTaskCheckedToggle = function (id, isComplete) {
        var taskModel = this.taskModels.find(function (taskModel) {
            return taskModel.id === id;
        });
        taskModel.isComplete = isComplete;
        this.taskRepository.update(taskModel);
        this.updateViews();
    };


    TodosController.prototype.handleTaskRemoveClick = function (id) {
        var taskModel = this.taskModels.find(function (taskModel) {
            return taskModel.id === id;
        });
        this.taskRepository.delete(taskModel);
        this.taskModels.splice(this.taskModels.indexOf(taskModel), 1);
        this.updateViews();
    };


    TodosController.prototype.handleTaskInputFormViewSubmit = function (target, data) {
        if (!data.description) {
            return;
        }
        var taskModel = this.taskRepository.create(data);
        this.taskModels.push(taskModel);
        this.taskInputFormView.reset();
        this.updateViews();
    };


    return TodosController;
});
