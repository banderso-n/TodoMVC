define(function (require) {
    'use strict';

    // Third party libs and polyfills
    require('polyfills/Array.prototype.find');
    var $ = require('jquery');
    var EventEmitter = require('EventEmitter');

    // Views
    var FormView = require('views/FormView');
    var TableView = require('views/TableView');


    function TodosController (taskRepository) {

        this.taskRepository = taskRepository;

        this.eventEmitter = new EventEmitter();

        this.tableView = null;

        this.taskInputFormView = null;

        this.taskModels = taskRepository.getAll();

        this.handleTaskRemoveClick = this.handleTaskRemoveClick.bind(this);
        this.handleTaskCheckedToggle = this.handleTaskCheckedToggle.bind(this);
        this.handleTaskInputFormViewSubmit = this.handleTaskInputFormViewSubmit.bind(this);
        this.handleTaskModelsChangeForTableView = this.handleTaskModelsChangeForTableView.bind(this);

        this.init();
    }


    TodosController.EVENT = {
        TASK_MODELS_CHANGE: 'TodosController:taskModelsChange'
    };


    TodosController.prototype.init = function () {
        var $tableView = $('#js-tableView');
        if ($tableView.length !== 0) {
            this._initializeTableView($tableView);
        }

        var $taskInputFormView = $('#js-taskInputFormView');
        if ($taskInputFormView.length !== 0) {
            this._initializeTaskInputFormView($taskInputFormView);
        }
    };


    TodosController.prototype._initializeTableView = function ($element) {
        this.tableView = new TableView($element);
        this.tableView.render(this.taskModels);
        this.tableView.eventEmitter.on(TableView.EVENT.TASK_CHECKED_TOGGLE, this.handleTaskCheckedToggle);
        this.tableView.eventEmitter.on(TableView.EVENT.TASK_REMOVE_CLICK, this.handleTaskRemoveClick);
        this.eventEmitter.on(TodosController.EVENT.TASK_MODELS_CHANGE, this.handleTaskModelsChangeForTableView);
    };


    TodosController.prototype._initializeTaskInputFormView = function ($element) {
        this.taskInputFormView = new FormView($element);
        this.taskInputFormView.eventEmitter.on(FormView.EVENT.SUBMIT, this.handleTaskInputFormViewSubmit);
    };


    TodosController.prototype.handleTaskModelsChangeForTableView = function () {
        this.tableView.render(this.taskModels);
    };


    TodosController.prototype.handleTaskCheckedToggle = function (id, isComplete) {
        var taskModel = this.taskModels.find(function (taskModel) {
            return taskModel.id === id;
        });
        taskModel.isComplete = isComplete;
        this.taskRepository.update(taskModel);
        this.eventEmitter.trigger(TodosController.EVENT.TASK_MODELS_CHANGE);
    };


    TodosController.prototype.handleTaskRemoveClick = function (id) {
        var taskModel = this.taskModels.find(function (taskModel) {
            return taskModel.id === id;
        });
        this.taskRepository.delete(taskModel);
        this.taskModels.splice(this.taskModels.indexOf(taskModel), 1);
        this.eventEmitter.trigger(TodosController.EVENT.TASK_MODELS_CHANGE);
    };


    TodosController.prototype.handleTaskInputFormViewSubmit = function (target, data) {
        if (!data.description) {
            return;
        }
        var taskModel = this.taskRepository.create(data);
        this.taskModels.push(taskModel);
        this.taskInputFormView.reset();
        this.eventEmitter.trigger(TodosController.EVENT.TASK_MODELS_CHANGE);
    };


    return TodosController;
});
