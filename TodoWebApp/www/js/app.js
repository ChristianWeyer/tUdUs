$(function () {
    window.kendoMobileApplication = new kendo.mobile.Application($(document.body), {
        transition: 'none',
        hideAddressBar: true
    });

    window.addEventListener("online", todosApp.appOnline, false);
    window.addEventListener("offline", todosApp.appOffline, false);

    document.addEventListener("deviceready", todosApp.deviceready, false);
    
    if(!navigator.onLine) {
        todosApp.appOffline();
    }
});

todosApp.deviceready = function () {
    // Code from above should go here for real device app
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
