/// <reference path="../app/js/jquery-1.7.1.min.js" />
/// <reference path="../app/js/jquery.base64.min.js" />
/// <reference path="../app/js/underscore-min.js" />
/// <reference path="../app/js/kendo.mobile.min.js" />
/// <reference path="../app/js/amplify.min.js" />
/// <reference path="../app/js/jquery.signalR-0.5.3.min.js" />
/// <reference path="../app/js/notifier.min.js" />
/// <reference path="../app/js/signalr.hubs.js" />
/// <reference path="../app/js/jquery.ba-bbq.min.js" />

/// <reference path="../app/scripts/app.js" />
/// <reference path="../app/scripts/applicationConstants.js" />
/// <reference path="../app/scripts/views.js" />
/// <reference path="../app/scripts/services/httpConstants.js" />
/// <reference path="../app/scripts/services/notifications.js" />
/// <reference path="../app/scripts/services/dataservices.js" />
/// <reference path="../app/scripts/viewmodels/authenticationViewModel.js" />
/// <reference path="../app/scripts/viewmodels/newTodoItemViewModel.js" />
/// <reference path="../app/scripts/viewmodels/todosViewModel.js" />
/// <reference path="../app/scripts/viewmodels/errorViewModel.js" />
/// <reference path="../app/scripts/viewmodels/acsViewModel.js" />
/// <reference path="../app/scripts/viewmodels/settingsViewModel.js" />

// NOT functional at the moment
module("dataservices", {
    setup: function () {
        window.kendoMobileApplication = new kendo.mobile.Application($(document.body), {
            transition: 'slide'
        });
    },
    teardown: function () {        
    }
});

test("callLoginPing_WithCorrectUsernameAndPassword", function () {
    var login = dataservices.callLoginPing("w", "w");
});