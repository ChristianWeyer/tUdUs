getBaseUrl = function () {
    //var host = "http://tttodos.azurewebsites.net/";
    var host = "http://localhost:7778/";
    var baseUrl = host;
    
    if(!(ttTools.isInApp() || ttTools.isInPhoneGapApp())) {
        baseUrl = "../../";
    };
    
    return baseUrl;
};

var endpoints = {
    todos: getBaseUrl() + "api/todos/",
    ping: getBaseUrl() + "api/ping/",
    pictures: getBaseUrl() + "api/pictures/",
    signalr: getBaseUrl() + "signalr",
    log: getBaseUrl() + "api/log/",
    acs: getBaseUrl() + "api/acs/getidps?ns=tttodos&realm=http%3A%2F%2Ftt.com%2Fmobile%2Ftodos",
    oauth: "https://identity.thinktecture.com/samplecw/issue/oauth2/authorize"
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
    Password: "password", // yes, NOT good... ;(
    AuthenticationToken: "authenticationToken"
};

var images = {
    DefaultItemPicture: "../images/noimage.png"  
};