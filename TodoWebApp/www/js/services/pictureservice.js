var pictureservice = (function () {
    function handleError(error) {
        var errorString = JSON.stringify(error);
        console.log(errorString);
        
        errorViewModel.showErrorDialog(errorString);
    }

    function deferredCapture() {
        return $.Deferred(function (dfd) {
            navigator.camera.getPicture(dfd.resolve, dfd.reject, {
                quality: 25,
                targetWidth: 225,
                targetHeigth: 300,
                destinationType: Camera.DestinationType.FILE_URL,
                sourceType: Camera.PictureSourceType.CAMERA
            });            
        }).promise();
    }
    
    function deferredUpload(url) {
        return $.Deferred(function (dfd) {
            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = url.substr(url.lastIndexOf('/') + 1);
            options.mimeType = "image/jpeg";
            options.chunkedMode = false;

            var transfer = new FileTransfer();
            transfer.upload(url, endpoints.pictures,
                dfd.resolve, dfd.reject, options);
        }).promise();
    }

    return {
        takePicture: function () {            
            return deferredCapture()
                .fail(function (error) {
                    handleError(error);
                });
        },
        
        uploadPicture: function (imageUrl) {
            todosApp.Views.showLoader("Uploading...");
            
            return deferredUpload(imageUrl)
                .always(function () {
                    todosApp.Views.hideLoader();
                })
                .fail(function (error) {
                    handleError(error);
                });
        }
    };
}());
