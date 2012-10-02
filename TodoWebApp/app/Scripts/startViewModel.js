/// <reference path="../js/_references.js" />

var startViewModel = kendo.observable({
    openLoginView: function () {
        if (settingsViewModel.authenticationMode === "ACS") {
            window.kendoMobileApplication.navigate("#acsLogin");
        }
        else {
            $('#loginDialog').data("kendoMobileModalView").open();
        }
    }
});
