kendoTools.templateLoader = (function () {    
    return {
        loadExternalTemplate: function (path) {
            return $.get(path)
                .success(function(result) {
                    $("body").append(result);
                })
                .error(function(err) {
                    alert("Error loading templates: " + err);
                });
        }
    };
})();