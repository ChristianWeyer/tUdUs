var newTodoItemViewModel = kendo.observable({
    title: "",
    details: "",
    location: "",
    pictureUrl: null,

    saveTodo: function () {
        var self = this;

        if (todosApp.Views.addTodoPageValidator.validate()) {
            if (self.get("pictureUrl") !== null && self.get("pictureUrl") !== images.DefaultItemPicture) {
                pictureservice.uploadPicture(self.get("pictureUrl"))
                    .done(function (r) {
                        var responseString = decodeURIComponent(r.response);
                        var response = JSON.parse(responseString);
                        var location = response[0].location;

                        self.set("pictureUrl", location);

                        self.saveTodoCore(self.toJSON());
                    });
            }
            else {
                self.saveTodoCore(self.toJSON());
            }
        }
    },

    takePicture: function () {
        var self = this;

        pictureservice.takePicture()
            .done(function (imageUrl) {
                self.set("pictureUrl", imageUrl);
            });
    },
    
    saveTodoCore: function (item) {
        var self = this;

        item.id = ttTools.createGuid();
        item.created = new Date().toUTCString();

        dataservices.create(endpoints.todos, item)
            .done(function (itemFromServer) {
                todosViewModel.addLocalItem(itemFromServer);

                self.set("title", "");
                self.set("details", "");
                self.set("pictureUrl", images.DefaultItemPicture);

                window.kendoMobileApplication.navigate("#todosPage");
                $("#navigationTabStrip").data("kendoMobileTabStrip").switchTo("items.html");
            });
    }
});
