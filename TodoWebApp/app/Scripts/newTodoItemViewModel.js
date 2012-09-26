/// <reference path="../js/_references.js" />

var newTodoItemViewModel = kendo.observable({
    title: "",
    details: "",

    saveTodo: function () {
        var self = this;

        var item =
        {
            title: this.get("title"),
            details: this.get("details")
        };

        remoteservices.saveTodo(item)
            .done(function () {
                todosViewModel.addLocalItem(item);
                window.kendoMobileApplication.navigate("#todosPage");

                self.set("title", "");
                self.set("details", "");
            });
    }
});
