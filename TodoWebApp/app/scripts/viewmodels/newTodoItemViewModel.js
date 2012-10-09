var newTodoItemViewModel = kendo.observable({
    title: "",
    details: "",
    pictureUrl: null,

    saveTodo: function () {
        if (addTodoPageValidator.validate()) {
            pictureservice.uploadPicture(this.get("pictureUrl"))
                .done(function (r) {                    
                    var responseString = decodeURIComponent(r.response);
                    var response = JSON.parse(responseString);
                    var location = response[0].location;
                    
                    newTodoItemViewModel.set("pictureUrl", location);

                    dataservices.saveTodo(newTodoItemViewModel.toJSON())
                        .done(function (itemFromServer) {
                            todosViewModel.addLocalItem(itemFromServer);

                            newTodoItemViewModel.set("title", "");
                            newTodoItemViewModel.set("details", "");
                            newTodoItemViewModel.set("pictureUrl", null);

                            window.kendoMobileApplication.navigate("#todosPage");
                        });
                });
        }
    },

    takePicture: function () {
        pictureservice.takePicture()
            .done(function (imageUrl) {              
                var imagePane = $("#capturedImagePane");
                imagePane.show();
                
                newTodoItemViewModel.set("pictureUrl", imageUrl);
            });
    }
});
