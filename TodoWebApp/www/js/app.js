$(function () {
    window.onerror = function (errorMsg, url, lineNumber) {
        ttTools.logger.fatal("Uncaught error: " + errorMsg + " in " + url + ", line " + lineNumber);
    };

    ttTools.logger.info("Startup...");

    $(document).bind("APP_READY", function () {
        $("#preLoad").css("opacity", "0").css("visibility", "hidden");
    });

    if (ttTools.isInPhoneGapApp()) {
        document.addEventListener("deviceready", todosApp.deviceready, false);
    } else {
        todosApp.load();
    }
});

todosApp.deviceready = function () {
    todosApp.load();
};

todosApp.load = function () {
    $.when(ttTools.templateLoader.loadExternalTemplate("../templates/tasksList.tmpl.html"),
               ttTools.templateLoader.loadExternalTemplate("../templates/idpList.tmpl.html"),
               ttTools.templateLoader.loadExternalTemplate("../templates/pictureGallery.tmpl.html"))
            .then(
                function () {
                    todosApp.init();
                },
                function (error) {
                    alert(JSON.stringify(error));
                }
        );
};

todosApp.init = function () {
    var platform = '';
    if (ttTools.isInApp()) platform = 'meego';

    window.kendoMobileApplication =
        new kendo.mobile.Application($(document.body), {
            transition: 'slide',
            hideAddressBar: true,
            platform: platform
        });

    todosViewModel.init();

    $.subscribe(dataServicesEvents.error, function (e, errorText) {
        todosApp.Views.hideLoader();
        errorViewModel.showErrorDialog(errorText);
    });
    $.subscribe(dataServicesEvents.action, function (e, statusText) {
        if (!todosApp.config.suppressLoader) {
            todosApp.Views.showLoader(statusText);
        }
    });
    $.subscribe(dataServicesEvents.endaction, function (e) {
        todosApp.Views.hideLoader();
    });

    window.addEventListener("online", todosApp.appOnline, false);
    window.addEventListener("offline", todosApp.appOffline, false);

    $(document).trigger("APP_READY");

    if (!navigator.onLine) {
        todosApp.appOffline();
    }
};

todosApp.appOnline = function () {
    showNotification({
        message: "ONLINE",
        type: "success",
        autoClose: true,
        duration: 3
    });
};

todosApp.appOffline = function () {
    showNotification({
        message: "OFFLINE",
        type: "error"
    });
};
