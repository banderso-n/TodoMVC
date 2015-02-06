define(function (require) {
    'use strict';

    var $ = require('jquery');
    var FormView = require('views/FormView');
    var CollectionView = require('views/CollectionView');
    var CounterView = require('views/CounterView');
    var ItemView = require('views/ItemView');


    function TodosController (taskRepository) {

        this.taskRepository = taskRepository;

        this.taskModels = taskRepository.getAll();

        this.collectionView = null;

        this.counterView = null;

        this.taskInputFormView = null;

        this.handleCollectionViewAdd = this.handleCollectionViewAdd.bind(this);
        this.handleItemViewRemoveRequest = this.handleItemViewRemoveRequest.bind(this);
        this.handleItemViewToggleRequest = this.handleItemViewToggleRequest.bind(this);
        this.handleTaskInputFormViewSubmit = this.handleTaskInputFormViewSubmit.bind(this);

        this.init();
    }


    TodosController.prototype.init = function () {
        var $collectionView = $('#js-collectionView');
        if ($collectionView.length !== 0) {
            this._initializeCollectionView($collectionView);
        }

        var $counterView = $('#js-counterView');
        if ($counterView.length !== 0) {
            this._initializeCounterView($counterView);
        }

        var $taskInputFormView = $('#js-taskInputFormView');
        if ($taskInputFormView.length !== 0) {
            this._initializeTaskInputFormView($taskInputFormView);
        }
    };


    TodosController.prototype._initializeCollectionView = function ($element) {
        this.collectionView = new CollectionView($element);
        this.collectionView.eventEmitter.on(CollectionView.EVENT.ADD, this.handleCollectionViewAdd);
        this.taskModels.forEach(function (taskModel) {
            var itemView = new ItemView(undefined, taskModel);
            this.collectionView.add(itemView);
        }, this);
    };


    TodosController.prototype._initializeCounterView = function ($element) {
        this.counterView = new CounterView($element, this.taskModels);
        this.counterView.render();
    };


    TodosController.prototype._initializeTaskInputFormView = function ($element) {
        this.taskInputFormView = new FormView($element);
        this.taskInputFormView.eventEmitter.on(FormView.EVENT.SUBMIT, this.handleTaskInputFormViewSubmit);
    }


    TodosController.prototype.handleCollectionViewAdd = function (target, itemView) {
        itemView.eventEmitter.on(ItemView.EVENT.REMOVE_REQUEST, this.handleItemViewRemoveRequest);
        itemView.eventEmitter.on(ItemView.EVENT.TOGGLE_REQUEST, this.handleItemViewToggleRequest);
    };


    TodosController.prototype.handleItemViewToggleRequest = function (itemView, isComplete) {
        itemView.model.isComplete = isComplete;
        this.taskRepository.update(itemView.model);
        itemView.render();
        this.counterView.render();
    };


    TodosController.prototype.handleItemViewRemoveRequest = function (itemView) {
        this.taskRepository.delete(itemView.model);
        this.taskModels.splice(this.taskModels.indexOf(itemView.model), 1);
        this.collectionView.remove(itemView);
        this.counterView.render();
    };


    TodosController.prototype.handleTaskInputFormViewSubmit = function (target, data) {
        if (!data.description) {
            return;
        }
        var taskModel = this.taskRepository.create(data);
        this.taskModels.push(taskModel);
        this.collectionView.add(new ItemView(undefined, taskModel));
        this.counterView.render();
        this.taskInputFormView.reset();
    };


    return TodosController;
});
