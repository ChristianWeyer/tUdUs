var startViewModel = kendo.observable({
    openLoginView: function () {
        if (settingsViewModel.authenticationMode === authenticationModes.ACS) {
            window.kendoMobileApplication.navigate("acs.html#acsLogin");
            //$("#navigationTabStrip").data("kendoMobileTabStrip").switchTo("index.html");
        }
        else {
            $('#loginDialog').data("kendoMobileModalView").open();
        }
    }
});
