var startViewModel = kendo.observable({
    openLoginView: function () {
        if (settingsViewModel.authenticationMode === authenticationModes.ACS) {
            window.kendoMobileApplication.navigate("acs.html#acsLogin");
            $("#navigationTabStrip").data("kendoMobileTabStrip").switchTo("index.html");
        }
        else if (settingsViewModel.authenticationMode === authenticationModes.Basic) {
            $('#loginDialog').data("kendoMobileModalView").open();
        }
        else {
            oauth2ViewModel.openAuthWindow("https://vs2012devwin8/idsrv/issue/oauth2/authorize?client_id=tt_tudus&scope=http%3A%2F%2Ftt.com%2Fmobile%2Ftodos&response_type=token&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob");
        }
    }
});
