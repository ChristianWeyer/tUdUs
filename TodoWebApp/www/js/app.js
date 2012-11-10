$(function () {
  $(document).bind("APP_READY", function () {
        $("#preLoad").css("opacity", "0").css("visibility", "hidden");
    });

    $.when(kendoTools.templateLoader.loadExternalTemplate("../templates/tasksList.tmpl.html"),
        kendoTools.templateLoader.loadExternalTemplate("../templates/idpList.tmpl.html"))
        .then(
            function () {
                //document.addEventListener("deviceready", todosApp.deviceready, false);
                todosApp.init();
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
    //cordova.exec(null, null, "PixAuth","loginWithBadCert",["https://vs2012devwin8"]);
    //cordova.exec(null, null, "PixAuth","loginWithBadCert",["https://vs2012devwin8:8888"]);
    
    window.kendoMobileApplication =
        new kendo.mobile.Application($(document.body), {
            transition: 'none',
            hideAddressBar: true
    });

    todosViewModel.init();
    
    amplify.subscribe(dataServicesEvents.error, function (errorText) {
        errorViewModel.showErrorDialog(errorText);
    });
    amplify.subscribe(dataServicesEvents.action, function (statusText) {
        todosApp.Views.showLoader(statusText);
    });
    amplify.subscribe(dataServicesEvents.endaction, function () {
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
