$(function () {
    $.when(templateLoader.loadExternalTemplate("templates/tasksListTemplate.tmpl.html"),
        templateLoader.loadExternalTemplate("templates/idpListTemplate.tmpl.html"))
    .then(function() {
        document.addEventListener("deviceready", deviceready, false);    
    });
});

function deviceready() {
    window.kendoMobileApplication = new kendo.mobile.Application($(document.body), {
        transition: 'slide'
    });

    addEvent(window, 'online', networkConnectivityChanged);
    addEvent(window, 'offline', networkConnectivityChanged);
    
    //var appElement = $("#theApp");
    //var app = new kendo.mobile.Application(appElement, {
    //    transition: 'slide'
    //});

    //window.kendoMobileApplication = app;
    
    //appElement.show();
    //appElement.css("opacity", 1);
}

function networkConnectivityChanged() {    
    if (navigator.onLine) {
        Notifier.info('ONLINE');
    }
    else {
        Notifier.error('OFFLINE');
    }
}

var addEvent = (function () {
    if (document.addEventListener) {
        return function (el, type, fn) {
            if (el && el.nodeName || el === window) {
                el.addEventListener(type, fn, false);
            } else if (el && el.length) {
                for (var i = 0; i < el.length; i++) {
                    addEvent(el[i], type, fn);
                }
            }
        };
    } else {
        return function (el, type, fn) {
            if (el && el.nodeName || el === window) {
                el.attachEvent('on' + type, function () { return fn.call(el, window.event); });
            } else if (el && el.length) {
                for (var i = 0; i < el.length; i++) {
                    addEvent(el[i], type, fn);
                }
            }
        };
    }
})();
