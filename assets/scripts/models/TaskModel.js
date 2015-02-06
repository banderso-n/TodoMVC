define(function (require) {
    'use strict';


    function TaskModel () {

        this.description = '';

        this.id = -1;

        this.isComplete = false;

    }


    TaskModel.prototype.fromJSON = function (json) {
        this.description = (json.description !== undefined) ? json.description : this.description;
        this.id = (json.id !== undefined) ? json.id : this.id;
        this.isComplete = (json.isComplete !== undefined) ? json.isComplete : this.isComplete;
        return this;
    };


    return TaskModel;
});
