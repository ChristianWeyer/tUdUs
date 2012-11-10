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
            oauth2ViewModel.openAuthWindow();
        }
    }
});
