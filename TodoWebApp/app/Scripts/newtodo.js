/// <reference path="../js/_references.js" />

var todoItemViewModel = kendo.observable({
    title: "",
    details: "",

    saveTodo: function () {
        var self = this;

        var item =
        {
            title: this.get("title"),
            details: this.get("details")
        };

        requests.saveTodo(item)
            .done(function () {
                window.kendoMobileApplication.navigate("#todosPage");

                self.set("title", "");
                self.set("details", "");
            });
    }
});
