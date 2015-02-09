define(function (require) {
    'use strict';


    function TaskModel () {

        /**
         * A human-readable description of the task.
         *
         * @property taskModel.description
         * @type {String}
         * @default ''
         */
        this.description = '';

        /**
         * A unique identifier for the task instance.
         *
         * @property taskModel.id
         * @type {Number}
         * @default -1
         */
        this.id = -1;

        /**
         * Indicates whether or not the task instance is complete.
         *
         * @property taskModel.isComplete
         * @type {Boolean}
         * @default false
         */
        this.isComplete = false;

    }


    TaskModel.isCompleteEvaluator = function (taskModel) {
        return taskModel.isComplete === true;
    };


    TaskModel.prototype.fromJSON = function (json) {
        this.description = (json.description !== undefined) ? json.description : this.description;
        this.id = (json.id !== undefined) ? json.id : this.id;
        this.isComplete = (json.isComplete !== undefined) ? json.isComplete : this.isComplete;
        return this;
    };


    return TaskModel;
});
