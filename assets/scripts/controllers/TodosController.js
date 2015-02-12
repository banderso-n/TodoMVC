define(function (require) {
    'use strict';

    // Third party libs and polyfills
    require('polyfills/Array.prototype.find');
    var $ = require('jquery');

    // Views
    var AnalyticsView = require('views/AnalyticsView');
    var FormView = require('views/FormView');
    var TableView = require('views/TableView');


    /**
     * Instantiates child views and models and handles communication between them
     *
     * @class TodosController
     * @constructor
     * @param {TaskRepository} taskRepository  Maps to the controller's taskRepository property
     */
    function TodosController (taskRepository) {

        /**
         * The thing responsible for sending and receiving remote task data
         *
         * @property todosController.taskRepository
         * @type {TaskRepository}
         */
        this.taskRepository = taskRepository;

        /**
         * The thing responsible for displaying the task data's analytics
         *
         * @property todosController.analyticsView
         * @type {AnalyticsView}
         * @default null
         */
        this.analyticsView = null;

        /**
         * The thing responsible for displaying the tasks in a table format
         *
         * @property todosController.tableView
         * @type {TableView}
         * @default null
         */
        this.tableView = null;

        /**
         * The thing responsible for allowing the user to input more tasks
         *
         * @property todosController.taskInputFormView
         * @type {FormView}
         * @default null
         */
        this.taskInputFormView = null;

        /**
         * The task data as an array of TaskModel instances
         *
         * @property todosController.taskModels
         * @type {TaskModel[]}
         * @default []
         */
        this.taskModels = taskRepository.getAll();

        // Handlers with their scope bound to this controller instance
        this.handleTaskRemoveClick = this.handleTaskRemoveClick.bind(this);
        this.handleTaskCheckedToggle = this.handleTaskCheckedToggle.bind(this);
        this.handleTaskInputFormViewSubmit = this.handleTaskInputFormViewSubmit.bind(this);

        this.init();
    }


    /**
     * Initialize child views if they're present in the document
     *
     * @method todosController.init
     */
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


    TodosController.prototype._initializeTaskInputFormView = function ($element) {
        this.taskInputFormView = new FormView($element);
        this.taskInputFormView.eventEmitter.on(FormView.EVENT.SUBMIT, this.handleTaskInputFormViewSubmit);
    };


    /**
     * Updates child views by telling them to render the current array of taskModels
     *
     * @method todosController.updateViews
     */
    TodosController.prototype.updateViews = function () {
        this.tableView.render(this.taskModels);
        this.analyticsView.render(this.taskModels);
    };


    /**
     * Handles when the user checks or unchecks a task in the todosController's tableView property
     *
     * @method todosController.handleTaskCheckedToggle
     * @param  {Number}  id         The id of the task being checked or unchecked
     * @param  {Boolean} isChecked  Whether the task was checked or unchecked
     */
    TodosController.prototype.handleTaskCheckedToggle = function (id, isChecked) {
        debugger;
        var taskModel = this.taskModels.find(function (taskModel) {
            return taskModel.id === id;
        });
        taskModel.isComplete = isChecked;
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


    /**
     * Handles when the user submits a new task with the todosController's taskInputFormView property
     *
     * @method todosController.handleTaskInputFormViewSubmit
     * @param  {FormView}   target  The FormView instance that triggered the custom 'submit' event
     * @param  {Object}     data    The form's data serialized as an Object
     */
    TodosController.prototype.handleTaskInputFormViewSubmit = function (target, data) {
        if (!data.description) { // If the description is false-y (undefined, empty string, etc), don't do anything
            return;
        }
        var taskModel = this.taskRepository.create(data);
        this.taskModels.push(taskModel);
        this.taskInputFormView.reset();
        this.updateViews();
    };


    return TodosController;
});
