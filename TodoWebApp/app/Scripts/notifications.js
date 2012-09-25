/// <reference path="../js/_references.js" />

function registerNotifications() {
    $.connection.hub.url = signalREndpoint;
    var hub = $.connection.todos;

    hub.addItem = function (connectionId, item) {        
        if ($.connection.hub.id !== connectionId) {
            Notifier.info(item.title, 'New TODO');
            todosViewModel.addLocalItem(item);
        }
    };

    $.connection.hub.start();

    NotifierjsConfig.defaultTimeOut = 1250;
    NotifierjsConfig.position = ["bottom", "right"];
    NotifierjsConfig.notificationStyles.width = "255";
};
