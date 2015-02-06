define(function (require) {
    'use strict';


    function CounterView ($element, taskModels) {

        this.$element = $element;

        this.taskModels = taskModels;

    }


    CounterView.isIncompleteEvaluator = function (taskModel) {
        return taskModel.isComplete === false;
    };



    CounterView.prototype.render = function () {
        var isIncompleteCount = this.taskModels.filter(CounterView.isIncompleteEvaluator).length;
        this.$element.text(isIncompleteCount);
        return this;
    };


    return CounterView;
});
