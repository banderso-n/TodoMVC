define(function (require) {
    'use strict';

    var TaskRepository = require('repositories/TaskRepository');
    var TodosController = require('controllers/TodosController');


    function App () {

        this.taskRepository = new TaskRepository();

        this.todosController = new TodosController(this.taskRepository);

    }


    return App;
});
