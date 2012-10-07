/// <reference path="../../js/_references.js" />

var authenticationViewModel = kendo.observable({
    userName: "",
    password: "",
    authenticated: false,

    doLogin: function () {
        var self = this;

        dataservices.callLoginPing(self.userName, self.password)
            .success(function () {
                notifications.register();

                amplify.store.sessionStorage(localStorageKeys.UserName, self.get("userName"));
                amplify.store.sessionStorage(localStorageKeys.Password, self.get("password"));

                self.set("authenticated", true);                
                self.closeLoginDialog(true);
            });
    },

    closeLoginDialog: function (success) {
        authenticationViewModel.set("userName", "");
        authenticationViewModel.set("password", "");

        $("#loginDialog").kendoMobileModalView("close");

        if (success === true) {
            window.kendoMobileApplication.navigate("#todosPage");
            Notifier.success("Authenticated", "Success");
        }
    }
});
