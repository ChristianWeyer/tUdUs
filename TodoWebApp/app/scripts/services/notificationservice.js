var notificationservice = (function () {
    return {
        register: function () {
            NotifierjsConfig.defaultTimeOut = 1750;
            NotifierjsConfig.position = ["bottom", "right"];
            NotifierjsConfig.notificationStyles.width = "255";

            $.connection.hub.url = endpoints.SignalREndpoint;
            var hub = $.connection.todos;

            hub.itemAdded = function (connectionId, item) {
                if ($.connection.hub.id !== connectionId) {
                    Notifier.info(item.title, 'REMOTE: New');
                    todosViewModel.addLocalItem(item);
                }
            };

            hub.itemUpdated = function (connectionId, item) {
                if ($.connection.hub.id !== connectionId) {
                    Notifier.info(item.title, 'REMOTE: Updated');
                    todosViewModel.updateLocalItem(item);
                }
            };

            hub.itemDeleted = function (connectionId, id) {
                if ($.connection.hub.id !== connectionId) {
                    Notifier.info(id, 'REMOTE: Deleted');
                    todosViewModel.deleteLocalItem(id);
                }
            };

            $.connection.hub.start().done(function () { });
        }
    };
}());
