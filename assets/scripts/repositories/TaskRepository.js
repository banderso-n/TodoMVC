define(function (require) {
    'use strict';

    var TaskModel = require('models/TaskModel');


    /**
     * This class is responsible for sending and receiving task data to remove locations. In this case, we're using localStorage.
     *
     * @class TaskRepository
     * @constructor
     */
    function TaskRepository () {

    }


    /**
     * The key to use in localStorage where we'll store the task data
     *
     * @property TaskRepository.LOCAL_STORAGE_KEY
     * @final
     * @type {String}
     */
    TaskRepository.LOCAL_STORAGE_KEY = 'taskRepository';


    /**
     * Create a new task entry by passing in some task json. The task is stored in localStorage and a new TaskModel is returned.
     *
     * @method taskRepository.create
     * @param  {Object} task  Some task data
     * @return {TaskModel}    The created task as a TaskModel
     */
    TaskRepository.prototype.create = function (task) {
        var taskModel = new TaskModel().fromJSON(task);
        var taskModels = this.getAll();
        var lastId = (taskModels.length !== 0) ? taskModels[taskModels.length - 1].id : 0;
        taskModel.id = lastId + 1;
        taskModels.push(taskModel);
        this.saveAll(taskModels);
        return taskModel;
    };


    /**
     * Replaces an entry in localStorage (by comparing ids) with the provided taskModel.
     *
     * @method taskRepository.update
     * @chainable
     * @param  {TaskModel} taskModel  The local instance of the taskModel to update.
     */
    TaskRepository.prototype.update = function (taskModel) {
        var id = taskModel.id;
        var taskModelUpdated = taskModel;
        var taskModels = this.getAll();
        var i = taskModels.length;
        while ((taskModel = taskModels[--i]) !== undefined) {
            if (taskModel.id === id) {
                taskModels.splice(i, 1, taskModelUpdated);
                break;
            }
        }
        this.saveAll(taskModels);
        return this;
    };


    /**
     * Removes a taskModel from localStorage
     *
     * @method taskRepository.delete
     * @chainable
     * @param  {TaskModel} taskModel  The local instance of the taskModel to delete from localStorage.
     */
    TaskRepository.prototype.delete = function (taskModel) {
        var id = taskModel.id;
        var taskModels = this.getAll();
        var i = taskModels.length;
        while ((taskModel = taskModels[--i]) !== undefined) {
            if (taskModel.id === id) {
                taskModels.splice(i, 1);
                break;
            }
        }
        this.saveAll(taskModels);
        return this;
    };


    /**
     * Retrieves all taskModels from localStorage.
     *
     * @method taskRepository.getAll
     * @return {TaskModel[]}
     */
    TaskRepository.prototype.getAll = function () {
        var tasks = JSON.parse(localStorage.getItem(TaskRepository.LOCAL_STORAGE_KEY)) || [];
        return tasks.map(function (task) {
            return new TaskModel().fromJSON(task);
        });
    };


    /**
     * Replaces all of the taskModels in localStorage with the array of taskModels provided.
     *
     * @method taskRepository.saveAll
     * @chainable
     * @param  {TaskModel[]} taskModels
     */
    TaskRepository.prototype.saveAll = function (taskModels) {
        localStorage.setItem(TaskRepository.LOCAL_STORAGE_KEY, JSON.stringify(taskModels));
        return this;
    };


    return TaskRepository;
});
