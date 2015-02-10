define(function (require) {
    'use strict';

    var TaskRepository = require('repositories/TaskRepository');
    var TodosController = require('controllers/TodosController');


    /**
     * This is the entry point of our application. It instantates all the controllers and injects any shared modules into them.
     *
     * @class App
     * @constructor
     */
    function App () {

        this.taskRepository = new TaskRepository();

        this.todosController = new TodosController(this.taskRepository);

    }


    return App;
});
