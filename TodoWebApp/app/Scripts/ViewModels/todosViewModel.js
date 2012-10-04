/// <reference path="../js/_references.js" />

var todosViewModel = kendo.observable({
    todosSource: new kendo.data.DataSource(),
    currentItem: {},

    navigateAddTodo: function () {
        window.kendoMobileApplication.navigate("#addTodoPage");
    },

    navigateTodoDetails: function (e) {
        this.set("currentItem", e.data);

        window.kendoMobileApplication.navigate("#todoDetailsPage");
    },

    addLocalItem: function (item) {
        this.todosSource.add(item);
    },

    updateLocalItem: function (item) {
        var oldItem = _.find(this.todosSource.data(), function (t) { return t.id === item.id; });
        var index = _.indexOf(this.todosSource.data(), oldItem);
        this.todosSource.data().splice(index, 1, item);
    },

    deleteLocalItem: function (id) {
        var item = _.find(this.todosSource.data(), function (t) { return t.id === id; });
        var index = _.indexOf(this.todosSource.data(), item);
        this.todosSource.data().splice(index, 1);
    },

    updateTodo: function () {
        var ci = this.get("currentItem");
        var item =
        {
            id: ci.id,
            title: ci.title,
            details: ci.details,
            done: ci.done
        };

        dataservices.updateTodo(item)
            .done(function () {
                Notifier.success(item.title, 'Updated');
            });
    },

    removeTodo: function (element) {
        var self = this;
        var item = element.data;

        // BUG: this does not work after adding an item - first needs reload/refresh
        dataservices.deleteTodo(item.id)
            .done(function (data) {
                var index = _.indexOf(self.todosSource.data(), item);
                self.todosSource.data().splice(index, 1);

                Notifier.warning(item.title, 'Deleted');
            });
    },

    loadTodos: function () {
        var self = this;

        dataservices.getTodos()
            .done(function (data) {
                self.todosSource.data(data);
            });
    }
});
