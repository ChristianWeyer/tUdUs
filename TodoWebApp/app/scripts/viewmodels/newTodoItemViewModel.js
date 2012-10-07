/// <reference path="../../js/_references.js" />

var newTodoItemViewModel = kendo.observable({
    title: "",
    details: "",
    pictureUrl: null,

    saveTodo: function () {
        if (addTodoPageValidator.validate()) {
            var self = this;

            dataservices.saveTodo(this.toJSON())
                .done(function (itemFromServer) {
                    self.set("title", "");
                    self.set("details", "");
                    self.set("pictureUrl", null);

                    todosViewModel.addLocalItem(itemFromServer);

                    window.kendoMobileApplication.navigate("#todosPage");
                });
        }
    },

    openCamera: function () {
        navigator.camera.getPicture(this.onCameraSuccess, this.onCameraFail, {
            quality: 40,
            destinationType: Camera.DestinationType.FILE_URL,
            sourceType: Camera.PictureSourceType.CAMERA
        });
    },

    onCameraSuccess: function (imageUrl) {
        newTodoItemViewModel.set("pictureUrl", imageUrl);
        
        var imagePane = $("#capturedImagePane");
        imagePane.show();        
    },

    onCameraFail: function (message) {
        alert("Oops: " + message);
    }
});
