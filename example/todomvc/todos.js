let UserFlow = require('../../')
let suite = UserFlow.suite
let TodoPage = require('./pages/todo')


suite('todos', (s) => {
    let c = new UserFlow.Client()

    s.beforeEach(() => {
        c.initPage('todo', TodoPage);
        return c.url('http://todomvc.com/examples/react/')
    });

    s.scenario('Loads page', () => {
        return c.todo.untilLoaded()
                .should.eventually.be.true
    });

    s.scenario('Create, complete, clear', () => {
        return c.todo.createTodo('Pass the tests')
                .then(() => c.todo.untilTodoExists('Pass the tests'))
                .then(() => c.todo.toggleComplete(1))
                .then(() => c.todo.getTodo(1).hasClass('completed'))
                    .should.eventually.be.true
                .then(() => c.todo.clearCompleted())
                .then(() => c.todo.todoItems.count())
                    .should.eventually.equal(0)
    });

    s.onFail(() => c.saveScreenshot('./fail.png'))
    //s.onSuccess(() => c.close())
})
