getBaseUrl = function () {
    var servicesBaseUrl;
    
    if(ttTools.isInApp()) {
        servicesBaseUrl = "http://tttodos.azurewebsites.net/";
    } else {
        servicesBaseUrl = "../../";
    };
    
    return servicesBaseUrl;
};

var endpoints = {
    todos: getBaseUrl() + "api/todos/",
    ping: getBaseUrl() + "api/ping/",
    pictures: getBaseUrl() + "api/pictures/",
    signalr: getBaseUrl() + "signalr",
    log: getBaseUrl() + "api/log/",
    acs: getBaseUrl() + "api/acs/getidps?ns=tttodos&realm=http%3A%2F%2Ftt.com%2Fmobile%2Ftodos",
    oauth: "https://ttidentity.cloudapp.net/test/issue/oauth2/authorize"
};

var oAuthConfig = {
    client_id: "tudus",
    scope: "http://tt.com/mobile/todos",
    response_type: "token",
    redirect_uri: getBaseUrl() + "www/js/services/oauthcallback.html"
};

var authenticationModes = {
    Basic: "Basic",
    ACS: "ACS",
    IdSrv: "IdSrv"
};

var localStorageKeys = {
    UserName: "userName",
    Password: "password", // yes, not good... ;(
    AuthenticationToken: "authenticationToken"
};

var images = {
    DefaultItemPicture: "../images/noimage.png"  
};