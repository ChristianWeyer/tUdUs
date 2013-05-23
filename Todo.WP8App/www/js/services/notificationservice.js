var notificationservice = (function () {
    return {
        register: function () {
            NotifierjsConfig.defaultTimeOut = 2000;
            NotifierjsConfig.position = ["bottom", "right"];
            NotifierjsConfig.notificationStyles.width = "255";

            $.connection.hub.logging = true;
            var hub = $.connection.todos;
 			$.connection.hub.url = endpoints.signalr;
                           
            hub.connection.error(function (error) {
        		if (error)
            		Notifier.warning("Connection error: " + error.message);
        		hub = null;
    		});
    		hub.connection.disconnected(function () {
        		Notifier.warning("Connection lost");
 
        		// IMPORTANT: continuously try re-starting connection
       	 		setTimeout(function () {                    
            		$.connection.hub.start();                    
        		}, 2000);
        	});          
        	$.connection.hub.connectionSlow(function () {
				Notifier.warning("Connectivity issues...?");
			});
                           
            hub.client.itemAdded = function (connectionId, item) {
                if ($.connection.hub.id !== connectionId) {
                    Notifier.info(item.title, 'REMOTE item: New');
                    todosViewModel.addLocalItem(item);
                }
            };

            hub.client.itemUpdated = function (connectionId, item) {
                if ($.connection.hub.id !== connectionId) {
                    Notifier.info(item.title, 'REMOTE item: Updated');
                    todosViewModel.updateLocalItem(item);
                }
            };

            hub.client.itemDeleted = function (connectionId, id) {
                if ($.connection.hub.id !== connectionId) {
                    Notifier.info(id, 'REMOTE item: Deleted');
                    todosViewModel.deleteLocalItem(id);
                }
            };

            //$.connection.hub.start().done(function () { });
    		// start the hub and handle after start actions
            $.connection.hub.start()
                .done(function () {
                    hub.connection.stateChanged(function (change) {
                        if (change.newState === $.signalR.connectionState.reconnecting) 
                            Notifier.warning("Connection lost");
                        else if (change.newState === $.signalR.connectionState.connected) {
                            Notifier.info("Online");
         
                            // IMPORTANT: On reconnection you have to reset the hub
                            hub = $.connection.todos;
                        }
                        else if (change.newState === $.signalR.connectionState.disconnected)
                            Notifier.warning("Disconnected");
                    })
                .error(function (error) {
                    Notifier.warning("Connection error: " + error.message);
                });
            });
        }
    };
}());
