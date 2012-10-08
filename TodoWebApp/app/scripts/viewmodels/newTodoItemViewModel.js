var newTodoItemViewModel = kendo.observable({
    title: "",
    details: "",
    pictureUrl: null,

    saveTodo: function () {
        if (addTodoPageValidator.validate()) {
            //kendoMobileApplication.loading = "<h1>Uploading...</h1>";
            kendoMobileApplication.showLoading();
            
            this.uploadPicture(this.get("pictureUrl"));        
        }
    },

    openCamera: function () {
        navigator.camera.getPicture(this.onCameraSuccess, this.onCameraFail, {
            quality: 25,
            targetWidth: 225,
            targetHeigth: 300,
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
    },

    uploadPicture: function (imageUrl) {
        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = imageUrl.substr(imageUrl.lastIndexOf('/') + 1);
        options.mimeType = "image/jpeg";
        options.chunkedMode = false;

        // TODO: set authorization header for authenticated upload
        //var params = new Object();
        //params.headers = { 'Authorization': '...' };
        //options.params = params;

        var ft = new FileTransfer();
        ft.upload(imageUrl, endpoints.PicturesEndpointUrl,
            this.onUploadSuccess, this.onUploadFail, options);
    },

    onUploadSuccess: function (r) {
        console.log("Upload succeeded: " + r.bytesSent);

        kendoMobileApplication.hideLoading();
        
        var location = (JSON.parse(r.response))[0].location;        
        alert(location);
        
        newTodoItemViewModel.set("pictureUrl", location);        
                
        dataservices.saveTodo(newTodoItemViewModel.toJSON())
            .done(function (itemFromServer) {
                todosViewModel.addLocalItem(itemFromServer);

                newTodoItemViewModel.set("title", "");
                newTodoItemViewModel.set("details", "");
                newTodoItemViewModel.set("pictureUrl", null);
                
                window.kendoMobileApplication.navigate("#todosPage");
            });        
    },

    onUploadFail: function (error) {
        alert("Error uploading: " + error.code);
        console.log("Upload error source " + error.source);
        console.log("Upload error target " + error.target);
    }
});
