/// <reference path="../js/_references.js" />

$(function () {
    window.kendoMobileApplication = new kendo.mobile.Application($(document.body), {
        transition: 'slide'
    });

    document.addEventListener("deviceready", deviceready, false);
});

function deviceready() {

}