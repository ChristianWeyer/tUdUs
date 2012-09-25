﻿/// <reference path="../js/_references.js" />

function registerNotifications() {
    $.connection.hub.url = signalREndpoint;
    var hub = $.connection.todos;

    hub.addItem = function (item) {
        toastr.info(item.Title, 'New TODO');
        todosViewModel.addLocalItem(item);
    };

    $.connection.hub.start();

    toastr.options = {
        positionClass: 'toast-bottom-right'
    };
};
