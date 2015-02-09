define(function (require) {
    'use strict';

    var TaskModel = require('models/TaskModel');


    function AnalyticsView ($element) {

        this.$element = $element;

        this.$progressBar = $element.find('[data-analytics-role="progressBar"]');

    }


    AnalyticsView.prototype.render = function (taskModels) {
        var percentComplete;
        if (taskModels.length === 0) {
            percentComplete = 1;
        } else {
            percentComplete = taskModels.filter(TaskModel.isCompleteEvaluator).length / taskModels.length;
        }
        this.$progressBar.width(percentComplete * 100 + '%');
        return this;
    };


    return AnalyticsView;
});
