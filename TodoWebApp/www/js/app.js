$(function () {
    $.when(kendoTools.templateLoader.loadExternalTemplate("../templates/tasksList.tmpl.html"),
        kendoTools.templateLoader.loadExternalTemplate("../templates/idpList.tmpl.html"))
        .then(
            function (data) {
                todosApp.init();
            },
            function (error) {
                alert(JSON.stringify(error));
            }
    );
});

todosApp.init = function () {
    document.addEventListener("deviceready", todosApp.deviceready, false);

    window.kendoMobileApplication = new kendo.mobile.Application($(document.body), {
        transition: 'slide',
        hideAddressBar: true
    });

    window.addEventListener("online", todosApp.appOnline, false);
    window.addEventListener("offline", todosApp.appOffline, false);

    if (!navigator.onLine) {
        todosApp.appOffline();
    }
};

todosApp.deviceready = function () {
    // Code from above should go here for real device app: detect PG?
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
