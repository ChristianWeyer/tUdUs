$(function () {
    window.kendoMobileApplication = new kendo.mobile.Application($(document.body), {
        transition: 'slide'
    });

    window.addEventListener("online", todosApp.appOnline, false);
    window.addEventListener("offline", todosApp.appOffline, false);

    document.addEventListener("deviceready", todosApp.deviceready, false);
});

todosApp.deviceready = function() {
};

// TODO: take these out of global scope
todosApp.appOnline = function() {
    Notifier.info('ONLINE');
};

todosApp.appOffline = function() {
    Notifier.info('OFFLINE');
};