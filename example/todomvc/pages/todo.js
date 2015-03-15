let UserFlow = require('../../../');

class TodoPage extends UserFlow.Page {
    initialize() {
        this.newTodo = this.query('#new-todo');
        this.todoList = this.query('#todo-list');
        this.todoItems = this.queryAll('#todo-list li');
        this.completeButton = this.query('#clear-completed');
    }

    untilLoaded() {
        return this.query('header h1').waitFor(500);
    }

    createTodo(text) {
        return this.newTodo.setValue(text)
                   .then(() => this.newTodo.addValue(['Enter']))
    }

    untilTodoExists(text) {
        return this.todoItems.waitForContent(text, 500);
    }

    toggleComplete(n) {
        return this.query(`#todo-list li:nth-child(${n}) input.toggle`).click();
    }
    
    clearCompleted() {
        return this.completeButton.waitFor(500)
                    //Because todomvc's UI is terrible
                    .then(() => this.completeButton.moveToObject(10, 5))
                    .then(() => this.client.leftClick());
    }

    getTodo(n) {
        return this.query(`#todo-list li:nth-child(${n})`);
    }
    
    getTodoCount() {
        return this.todoItems.count();
    }

}

module.exports = TodoPage;
