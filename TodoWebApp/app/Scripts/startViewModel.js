/// <reference path="../js/_references.js" />

var startViewModel = kendo.observable({
    openLoginView: function () {
        if (configuration.authenticationMode === "ACS") {
            window.kendoMobileApplication.navigate("#acsLogin");
        }
        else {
            $('#loginDialog').data("kendoMobileModalView").open();
        }
    }
});
