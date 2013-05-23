ttTools.templateLoader = (function () {
    return {
        loadExternalTemplate: function (path) {
            return $.get(path, dataTypes.HTML)
                .success(function(result) {
                    $("body").append(result);
                })
                .error(function(err) {
                    alert("Error loading templates: " + err);
                });
        }
    };
})();