var todosViewModel = kendo.observable({
    todosSource: new kendo.data.DataSource({ sort: { field: "title", dir: "asc" } }),
    currentItem: {},
    isDirty: false,
    
    init: function () {
        var self = this;
        
        $.subscribe(dataServicesEvents.dirty, function(key) {
            if (key === endpoints.todos && navigator.onLine) {
                self.set("isDirty", true);
            }
        });
    },
    
    pictureAvailable: function () {
        var ci = this.get("currentItem.pictureUrl");
        var result = (ci !== null && ci !== "null");

        return result;
    },

    navigateAddTodo: function () {        
        window.kendoMobileApplication.navigate("#addTodoPage");
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
        var item = this.get("currentItem").toJSON();

        dataservices.update(endpoints.todos, item)
            .done(function () {
                Notifier.success(item.title, 'Updated');
            });
    },

    removeTodo: function (element) {
        var self = this;
        var item = element.data;

        dataservices.destroy(endpoints.todos, item.id)
            .done(function () {
                var index = _.indexOf(self.todosSource.data(), item);
                self.todosSource.data().splice(index, 1);

                Notifier.warning(item.title, 'Deleted');
            });
    },

    loadTodos: function () {
        var self = this;

        dataservices.getList(endpoints.todos)
            .done(function (data) {
                self.todosSource.data(data);
            });
    },
    
    sync: function () {
        var self = this;

        dataservices.sync(endpoints.todos)
            .done(function () {
                self.loadTodos();
                self.set("isDirty", false);
            });
    }
});
