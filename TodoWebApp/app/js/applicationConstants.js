var servicesBaseUrl = "../";
//var servicesBaseUrl = "http://tttodos.azurewebsites.net/";

var endpoints = {
    ServiceEndpointUrl: servicesBaseUrl + "api/todos/",
    PingEndpointUrl: servicesBaseUrl + "api/ping/",
    PicturesEndpointUrl: servicesBaseUrl + "api/pictures/",
    SignalREndpoint: servicesBaseUrl + "signalr",
    AcsIdpsEndpoint: servicesBaseUrl + "api/acs/getidps?ns=tttodos&realm=http%3A%2F%2Ftt.com%2Fmobile%2Ftodos",
};

var authenticationModes = {
    Basic: "Basic",
    ACS: "ACS"
};

var localStorageKeys = {
    UserName: "userName",
    Password: "password", // yes, not good... ;(
    TodosList: "todoslist",
    AuthenticationToken: "authenticationToken"
};

var images = {
    DefaultItemPicture: "images/noimage.png"  
};