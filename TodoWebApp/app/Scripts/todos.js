/// <reference path="../js/_references.js" />

var todosViewModel = kendo.observable({
    todosSource: new kendo.data.DataSource(),

    navigateAddTodo: function () {
        window.kendoMobileApplication.navigate("#addTodoPage");
    },

    navigateTodoDetails: function (e) {
        var self = this;

        self.set("currentItem", e.data);

        window.kendoMobileApplication.navigate("#todoDetailsPage");
    },

    currentItem: null,

    updateTodo: function () {
        var ci = this.get("currentItem");
        var item =
        {
            id: ci.id,
            title: ci.title,
            details: ci.details,
            done: ci.done
        };

        requests.updateTodo(item)
            .done(function () {                
                Notifier.success(item.title, 'Updated');
            });
    },

    addLocalItem: function (item) {
        this.todosSource.add(item);
    },

    removeTodo: function (element) {
        var self = this;
        var item = element.data;

        requests.deleteTodo(item.id)
            .done(function (data) {
                var index = _.indexOf(self.todosSource.data(), item)
                self.todosSource.data().splice(index, 1);
                
                Notifier.warning(item.title, 'Deleted');
            });
    },

    loadTodos: function () {
        var self = this;

        requests.getTodos()
            .done(function (data) {
                self.todosSource.data(data);
            });
    }
});
