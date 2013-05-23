var acsViewModel = kendo.observable({
    idpsSource: new kendo.data.DataSource(),

    getIdps: function () {
        var self = this;

        $.ajax({
            url: endpoints.acs,
            type: httpVerbs.GET,
            dataType: dataTypes.JSON,
            beforeSend: function () { todosApp.Views.showLoader("Loading..."); }
        })
        .always(function () {
            todosApp.Views.hideLoader();
        })
        .done(function (data) {
            self.idpsSource.data(data);
        })
        .fail(function (error) {
            errorViewModel.showErrorDialog(error);
        });
    },

    openAuthWindow: function (url) {        
        if (url.indexOf("login.live.com") !== -1 || url.indexOf("login.microsoftonline.com") !== -1) {
            url = url + "&pcexp=false";
        }

        window.plugins.childBrowser.showWebPage(url, { showLocationBar: true });
        window.plugins.childBrowser.onLocationChange = this.onAuthUrlChange;
    },

    onAuthUrlChange: function (url) {
        if (url.toLowerCase().indexOf("acs/noop") !== -1) {
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
