/// <reference path="../js/_references.js" />

var authenticationViewModel = kendo.observable({
    userName: "",
    password: "",
    authenticated: false,

    doLogin: function () {
        var self = this;

        remoteservices.callLoginPing(self.userName, self.password)
            .success(function () {
                registerNotifications();

                amplify.store.sessionStorage("userName", self.get("userName"));
                amplify.store.sessionStorage("password", self.get("password"));

                self.set("authenticated", true);
                self.closeLoginDialog();
            });
    },

    closeLoginDialog: function () {
        this.set("userName", "");
        this.set("password", "");

        $("#loginDialog").kendoMobileModalView("close");
        window.kendoMobileApplication.navigate("#todosPage");
        Notifier.success("Authenticated", "Success");
    }
});
