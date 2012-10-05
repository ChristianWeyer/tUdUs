/// <reference path="../js/_references.js" />

var authenticationViewModel = kendo.observable({
    userName: "",
    password: "",
    authenticated: false,

    doLogin: function () {
        var self = this;

        dataservices.callLoginPing(self.userName, self.password)
            .success(function () {
                registerNotifications();

                amplify.store.sessionStorage("userName", self.get("userName"));
                amplify.store.sessionStorage("password", self.get("password"));

                self.set("authenticated", true);                
                self.closeLoginDialog(true);
            });
    },

    closeLoginDialog: function (success) {
        authenticationViewModel.set("userName", "");
        authenticationViewModel.set("password", "");

        $("#loginDialog").kendoMobileModalView("close");

        if (success) {
            window.kendoMobileApplication.navigate("#todosPage");
            Notifier.success("Authenticated", "Success");
        }
    }
});
