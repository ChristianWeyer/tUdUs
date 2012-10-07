/// <reference path="../js/_references.js" />

$(function () {
    window.kendoMobileApplication = new kendo.mobile.Application($(document.body), {
        transition: 'slide'
    });

    addEvent(window, 'online', networkConnectivityChanged);
    addEvent(window, 'offline', networkConnectivityChanged);

    document.addEventListener("deviceready", deviceready, false);    
});

function deviceready() {
}

function networkConnectivityChanged(event) {    
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
