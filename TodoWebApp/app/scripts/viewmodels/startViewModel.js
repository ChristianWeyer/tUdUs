var startViewModel = kendo.observable({
    openLoginView: function () {
        if (settingsViewModel.authenticationMode === authenticationModes.ACS) {
            window.kendoMobileApplication.navigate("#acsLogin");
        }
        else {
            $('#loginDialog').data("kendoMobileModalView").open();
        }
    }
});
