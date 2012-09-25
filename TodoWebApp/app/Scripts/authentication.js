/// <reference path="../js/_references.js" />

var loginViewModel = kendo.observable({
    userName: "",
    password: "",
    authenticated: false,

    doLogin: function () {
        var self = this;

        requests.callLoginPing(self.userName, self.password)
            .success(function () {
                amplify.store.sessionStorage("userName", self.get("userName"));
                amplify.store.sessionStorage("password", self.get("password"));

                self.set("authenticated", true);
                self.cancelLoginDialog();

                window.kendoMobileApplication.navigate("#todosPage");
            });
    },

    cancelLoginDialog: function () {
        var self = this;

        $("#loginDialog").kendoMobileModalView("close");

        self.set("userName", "");
        self.set("password", "");
    }
});
