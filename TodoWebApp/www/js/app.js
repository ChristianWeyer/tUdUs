$(function () {
    //$(document).bind("APP_READY", function () {
    //    $("#preLoad").css("opacity", "0").css("visibility", "hidden");
    //});
    
    //setTimeout(todosApp.init, 5000);
    
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
    window.kendoMobileApplication = new kendo.mobile.Application($(document.body), {
        transition: 'slide',
        hideAddressBar: true
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
