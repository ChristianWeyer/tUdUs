var authenticationViewModel = kendo.observable({
    userName: "",
    password: "",
    authenticated: false,

    doLogin: function () {
        var self = this;

        dataservices.loginPing(endpoints.ping, self.userName, self.password)
            .success(function () {
                todosViewModel.todosSource.data([]);
                todosViewModel.currentItem = {};
                
                notificationservice.register();

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
            window.kendoMobileApplication.navigate("items.html#todosPage");
            $("#navigationTabStrip").data("kendoMobileTabStrip").switchTo("items.html");
            
            Notifier.success("Authenticated", "Success");
        }
    }
});
