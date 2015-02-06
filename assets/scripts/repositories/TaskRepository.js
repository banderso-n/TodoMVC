define(function (require) {
    'use strict';

    var TaskModel = require('models/TaskModel');


    function TaskRepository () {

    }


    TaskRepository.LOCAL_STORAGE_KEY = 'taskRepository';


    TaskRepository.prototype.create = function (task) {
        var taskModel = new TaskModel().fromJSON(task);
        var taskModels = this.getAll();
        var lastId = (taskModels.length !== 0) ? taskModels[taskModels.length - 1].id : 0;
        taskModel.id = lastId + 1;
        taskModels.push(taskModel);
        this.saveAll(taskModels);
        return taskModel;
    };


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


    TaskRepository.prototype.getAll = function () {
        var tasks = JSON.parse(localStorage.getItem(TaskRepository.LOCAL_STORAGE_KEY)) || [];
        return tasks.map(function (task) {
            return new TaskModel().fromJSON(task);
        });
    };


    TaskRepository.prototype.saveAll = function (taskModels) {
        localStorage.setItem(TaskRepository.LOCAL_STORAGE_KEY, JSON.stringify(taskModels));
        return this;
    };


    return TaskRepository;
});
