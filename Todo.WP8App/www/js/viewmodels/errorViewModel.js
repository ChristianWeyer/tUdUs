var errorViewModel = kendo.observable({
    message: "",

    showErrorDialog: function (errorMessage) {
        $('#errorDialog').data("kendoMobileModalView").open();
        this.set("message", errorMessage);
    },

    closeErrorDialog: function () {
        $("#errorDialog").kendoMobileModalView("close");
        this.set("message", "");
    }
});
