var newTodoItemViewModel = kendo.observable({
    title: "",
    details: "",
    pictureUrl: null,

    saveTodo: function () {
        var self = this;
        
        if (addTodoPageValidator.validate()) {
            if (self.get("pictureUrl") !== null) {
                pictureservice.uploadPicture(self.get("pictureUrl"))
                    .done(function (r) {
                        var responseString = decodeURIComponent(r.response);
                        var response = JSON.parse(responseString);
                        var location = response[0].location;

                        self.set("pictureUrl", location);

                        self.saveTodoCore(self.toJSON());
                    });
            }
            
            self.saveTodoCore(self.toJSON());
        }
    },

    takePicture: function () {
        var self = this;
        
        pictureservice.takePicture()
            .done(function (imageUrl) {              
                var imagePane = $("#capturedImagePane");
                imagePane.show();
                
                self.set("pictureUrl", imageUrl);
            });
    },
    
    saveTodoCore: function (item) {
        var self = this;
        
        dataservices.saveTodo(item)
            .done(function (itemFromServer) {
                todosViewModel.addLocalItem(itemFromServer);

                self.set("title", "");
                self.set("details", "");
                self.set("pictureUrl", null);

                window.kendoMobileApplication.navigate("#todosPage");
            });
    }
});
