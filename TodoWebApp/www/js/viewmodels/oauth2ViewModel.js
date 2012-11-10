var oauth2ViewModel = kendo.observable({
    token: "",
    
    openAuthWindow: function () {
        var url = endpoints.oauth + "?" + $.param(oAuthConfig);
        
        if(window.plugins && window.plugins.childBrowser) {
            window.plugins.childBrowser.showWebPage(url, { showLocationBar: true });
            window.plugins.childBrowser.onLocationChange = this.onAuthUrlChange;
        } else {
            window.open(url, "Login", 'height=500,width=350');
        }
    },

    authCallback: function (params) {
        oauth2ViewModel.token = params["access_token"];
        oauth2ViewModel.process();
    },
    
    onAuthUrlChange: function (url) {                              
        if (url.toLowerCase().indexOf(oAuthConfig.redirect_uri) !== -1) {
            var params = $.deparam.fragment(url);
            oauth2ViewModel.token = params[oAuthConfig.redirect_uri + "#access_token"];
            window.plugins.childBrowser.close();

            oauth2ViewModel.process();
        }
    },
    
    process: function() {
        todosViewModel.todosSource.data([]);
        todosViewModel.currentItem = {};

        amplify.store.sessionStorage(localStorageKeys.AuthenticationToken, this.token);
        authenticationViewModel.authenticated = true;
        notificationservice.register();

        window.kendoMobileApplication.navigate("items.html#todosPage");
        $("#navigationTabStrip").data("kendoMobileTabStrip").switchTo("items.html");

        Notifier.success("Authenticated", "Success");
    }
});
