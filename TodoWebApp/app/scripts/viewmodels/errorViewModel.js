/// <reference path="../../js/_references.js" />

var errorViewModel = kendo.observable({
    message: "",

    showErrorDialog: function (errorMessage) {
        $('#errorDialog').data("kendoMobileModalView").open();
        this.set("message", errorMessage);
    },

    closeErrorDialog: function () {
        var self = this;

        $("#errorDialog").kendoMobileModalView("close");

        self.set("message", "");
    }
});
