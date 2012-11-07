var servicesBaseUrl = "../../";
//var servicesBaseUrl = "http://tttodos.azurewebsites.net/";
//var servicesBaseUrl = "http://vs2012devwin8/tudus/";

var endpoints = {
    ServiceEndpointUrl: servicesBaseUrl + "api/todos/",
    PingEndpointUrl: servicesBaseUrl + "api/ping/",
    PicturesEndpointUrl: servicesBaseUrl + "api/pictures/",
    SignalREndpoint: servicesBaseUrl + "signalr",
    AcsIdpsEndpoint: servicesBaseUrl + "api/acs/getidps?ns=tttodos&realm=http%3A%2F%2Ftt.com%2Fmobile%2Ftodos",
    IdpOauthEndpointUrl: "https://localhost/idsrv/issue/oauth2/authorize"
};

var oAuthConfig = {
    client_id: "tudus",
    scope: "http://tt.com/mobile/todos",
    response_type: "token",
    redirect_uri: "http://localhost/tudus/www/js/services/oauthcallback.html"
};

var authenticationModes = {
    Basic: "Basic",
    ACS: "ACS",
    IdSrv: "IdSrv"
};

var localStorageKeys = {
    UserName: "userName",
    Password: "password", // yes, not good... ;(
    TodosList: "todoslist",
    AuthenticationToken: "authenticationToken"
};

var images = {
    DefaultItemPicture: "../images/noimage.png"  
};