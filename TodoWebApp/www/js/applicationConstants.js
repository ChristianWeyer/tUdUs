//var servicesBaseUrl = "../../";
//var servicesBaseUrl = "http://tttodos.azurewebsites.net/";
var servicesBaseUrl = "http://vs2012devwin8/tudus/";

var endpoints = {
    ServiceEndpointUrl: servicesBaseUrl + "api/todos/",
    PingEndpointUrl: servicesBaseUrl + "api/ping/",
    PicturesEndpointUrl: servicesBaseUrl + "api/pictures/",
    SignalREndpoint: servicesBaseUrl + "signalr",
    AcsIdpsEndpoint: servicesBaseUrl + "api/acs/getidps?ns=tttodos&realm=http%3A%2F%2Ftt.com%2Fmobile%2Ftodos",
    IdpOauthEndpointUrl: "https://vs2012devwin8/idsrv/issue/oauth2/authorize?client_id=tt_tudus&scope=http%3A%2F%2Ftt.com%2Fmobile%2Ftodos&response_type=token&redirect_uri=http%3A%2F%2Flocalhost%2Ftudus_redirect"
};

var authenticationModes = {
    Basic: "Basic",
    ACS: "ACS",
    IdSrv: "IdSrv"
};

var oAuthRedirectUrl = "http://localhost/tudus_redirect";

var localStorageKeys = {
    UserName: "userName",
    Password: "password", // yes, not good... ;(
    TodosList: "todoslist",
    AuthenticationToken: "authenticationToken"
};

var images = {
    DefaultItemPicture: "../images/noimage.png"  
};