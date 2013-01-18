$(function () {
    ttTools.logger.info("Startup...");

    window.onerror = function (errorMsg, url, lineNumber) {
        ttTools.logger.fatal("Uncaught error: " + errorMsg + " in " + url + ", line " + lineNumber);
        console.log("Uncaught error: " + errorMsg + " in " + url + ", line " + lineNumber);
    };

    $(document).bind("APP_READY", function () {
        $("#preLoad").css("opacity", "0").css("visibility", "hidden");
    });

    $.when(ttTools.templateLoader.loadExternalTemplate("../templates/tasksList.tmpl.html"),
           ttTools.templateLoader.loadExternalTemplate("../templates/idpList.tmpl.html"),
           ttTools.templateLoader.loadExternalTemplate("../templates/pictureGallery.tmpl.html"))
        .then(
            function () {
                if (ttTools.isInApp()) {
                    document.addEventListener("deviceready", todosApp.deviceready, false);
                } else {
                    todosApp.init();
                }
            },
            function (error) {
                alert(JSON.stringify(error));
            }
    );
});

todosApp.deviceready = function () {
    todosApp.init();
};

todosApp.init = function () {
    // for debugging only
    if (cordova.exec !== undefined) {
        cordova.exec(null, null, "PixAuth", "loginWithBadCert", ["https://ttidentity.cloudapp.net"]);
    };
    
    window.kendoMobileApplication =
        new kendo.mobile.Application($(document.body), {
            transition: 'none',
            hideAddressBar: true
        });

    todosViewModel.init();

    $.subscribe(dataServicesEvents.error, function (e, errorText) {
        errorViewModel.showErrorDialog(errorText);
    });
    $.subscribe(dataServicesEvents.action, function (e, statusText) {
        if(!todosApp.config.suppressLoader) {
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
