$(function () {
    window.kendoMobileApplication = new kendo.mobile.Application($(document.body), {
        transition: 'none'
    });

    window.addEventListener("online", todosApp.appOnline, false);
    window.addEventListener("offline", todosApp.appOffline, false);

    document.addEventListener("deviceready", todosApp.deviceready, false);
    
    if(!navigator.onLine) {
        todosApp.appOffline();
    }
});

todosApp.deviceready = function() {
};

todosApp.appOnline = function() {
    showNotification({
        message: "ONLINE",
        type: "success",
        autoClose: true,
        duration: 3
    });
};

todosApp.appOffline = function() {
    showNotification({
        message: "OFFLINE",
        type: "error"
    });
};
