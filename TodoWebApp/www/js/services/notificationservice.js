var notificationservice = (function () {
    return {
        register: function () {
            NotifierjsConfig.defaultTimeOut = 2000;
            NotifierjsConfig.position = ["bottom", "right"];
            NotifierjsConfig.notificationStyles.width = "255";

            $.connection.hub.logging = true;

            $.connection.hub.url = endpoints.signalr;
            var hub = $.connection.todos;            
            
            $.connection.hub.connectionSlow(function () {
                Notifier.warning("Connectivity issues...?");
            });
            
            hub.client.itemAdded = function (connectionId, item) {
                if ($.connection.hub.id !== connectionId) {
                    Notifier.info(item.title, 'REMOTE: New');
                    todosViewModel.addLocalItem(item);
                }
            };

            hub.client.itemUpdated = function (connectionId, item) {
                if ($.connection.hub.id !== connectionId) {
                    Notifier.info(item.title, 'REMOTE: Updated');
                    todosViewModel.updateLocalItem(item);
                }
            };

            hub.client.itemDeleted = function (connectionId, id) {
                if ($.connection.hub.id !== connectionId) {
                    Notifier.info(id, 'REMOTE: Deleted');
                    todosViewModel.deleteLocalItem(id);
                }
            };

            $.connection.hub.start().done(function () { });
        }
    };
}());
