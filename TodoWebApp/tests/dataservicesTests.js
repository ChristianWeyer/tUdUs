/// <reference path="../www/js/libs/jquery-1.7.1.min.js" />
/// <reference path="../www/js/libs/jquery.base64.min.js" />
/// <reference path="../www/js/libs/amplify.min.js" />
/// <reference path="../www/js/applicationConstants.js" />
/// <reference path="../www/js/services/httpConstants.js" />
/// <reference path="../www/js/services/dataservices.js" />

// NOT functional at the moment
module("dataservicesTests", {
    setup: function () {
        //window.kendoMobileApplication = new kendo.mobile.Application($(document.body), {
        //    transition: 'none'
        //});
    },
    teardown: function () {        
    }
});

test("callLoginPing_WithCorrectUsernameAndPassword", function() {
    dataservices.loginPing("w", "w")
        .done(function () {
            alert("Success");
        });
});