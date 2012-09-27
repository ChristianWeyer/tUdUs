/// <reference path="../js/_references.js" />

var authenticationViewModel = kendo.observable({
    userName: "",
    password: "",
    authenticated: false,

    doLogin: function () {
        var self = this;

        remoteservices.callLoginPing(self.userName, self.password)
            .success(function () {
                amplify.store.sessionStorage("userName", self.get("userName"));
                amplify.store.sessionStorage("password", self.get("password"));

                self.set("authenticated", true);
                self.closeLoginDialog();

                registerNotifications();

                window.kendoMobileApplication.navigate("#todosPage");
            });
    },

    closeLoginDialog: function () {
        var self = this;

        $("#loginDialog").kendoMobileModalView("close");

        self.set("userName", "");
        self.set("password", "");
    }
});
