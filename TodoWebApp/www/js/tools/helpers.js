ttTools.createGuid = function () {
    var S4 = function() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
};

ttTools.isInPhoneGapApp = function() {
    return window.PhoneGap != undefined;
};

ttTools.isInApp = function() {
    var local = document.URL.indexOf("http://") === -1 && document.URL.indexOf("https://") === -1;
    
    return !ttTools.isInPhoneGapApp() && local;
};
