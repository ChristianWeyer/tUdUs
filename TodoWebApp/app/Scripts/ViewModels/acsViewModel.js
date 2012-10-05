/// <reference path="../js/_references.js" />

var acsViewModel = kendo.observable({
    idpsSource: new kendo.data.DataSource(),

    getIdps: function () {
        var self = this;

        $.ajax({
            url: acsIdpsEndpoint,
            type: 'get',
            dataType: 'json',
            beforeSend: function (xhr) { kendoMobileApplication.showLoading(); }
        })
        .always(function () {
            kendoMobileApplication.hideLoading();
        })
        .done(function (data) {
            self.idpsSource.data(data);
        })
        .fail(function (error) {
            errorViewModel.showErrorDialog(error);
        });
    },

    openAuthWindow: function (url) {
        console.log("openAuthWindow: " + url);

        if (url.indexOf("login.live.com") !== -1) {
            url = url + "&pcexp=false";
        }

        window.plugins.childBrowser.showWebPage(url, { showLocationBar: true });
        window.plugins.childBrowser.onLocationChange = this.onAuthUrlChange;
    },

    onAuthUrlChange: function (url) {
        if (url.indexOf("acs/noop") !== -1) {
            var params = $.deparam.querystring(url);
            var t = params.access_token;

            amplify.store.sessionStorage("authenticationToken", t);
            authenticationViewModel.authenticated = true;

            registerNotifications();

            window.plugins.childBrowser.close();
            window.kendoMobileApplication.navigate("#todosPage");
            Notifier.success("Authenticated", "Success");
        }
    }
});
