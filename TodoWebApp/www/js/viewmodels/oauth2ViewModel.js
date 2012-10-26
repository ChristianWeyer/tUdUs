var oauth2ViewModel = kendo.observable({

    openAuthWindow: function (url) {
        window.plugins.childBrowser.showWebPage(url, { showLocationBar: true });
        window.plugins.childBrowser.onLocationChange = this.onAuthUrlChange;
    },

    onAuthUrlChange: function (url) {
        if (url.toLowerCase().indexOf("urn:ietf:wg:oauth:2.0:oob") !== -1) {
            var params = $.deparam.querystring(url);
            var t = params.access_token;

            todosViewModel.todosSource.data([]);
            todosViewModel.currentItem = {};
            
            amplify.store.sessionStorage(localStorageKeys.AuthenticationToken, t);
            authenticationViewModel.authenticated = true;

            notificationservice.register();

            window.plugins.childBrowser.close();
            
            window.kendoMobileApplication.navigate("items.html#todosPage");
            $("#navigationTabStrip").data("kendoMobileTabStrip").switchTo("items.html");
            
            Notifier.success("Authenticated", "Success");
        }
    }
});
