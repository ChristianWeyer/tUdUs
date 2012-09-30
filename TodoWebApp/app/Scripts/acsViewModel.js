var acsViewModel = kendo.observable({
    idpsSource: new kendo.data.DataSource(),
    token: {},

    getIdps: function () {
        var self = this;

        //var staticAcsEndpoint = "http://localhost/Todo.WebApp/api/acs/getidps?ns=tttodos&realm=http%3A%2F%2Ftt.com%2Fmobile%2Ftodos";
        var staticAcsEndpoint = "http://tttodos.azurewebsites.net/api/acs/getidps?ns=tttodos&realm=http%3A%2F%2Ftt.com%2Fmobile%2Ftodos";

        $.ajax({
            url: staticAcsEndpoint,
            type: 'get',
            dataType: 'json'
        })
        .done(function (data) {
            self.idpsSource.data(data);
        })
        .fail(function (error) {
            alert(error);
        });
    },

    setToken: function (tokenResponse) {
        var token = tokenResponse.access_token;
        this.token = token;
    },

    openAuthWindow: function (url) {
        //window.open(url, '_blank', 'width=500,height=400');
        window.plugins.childBrowser.showWebPage(url, { showLocationBar: true });
        window.plugins.childBrowser.onClose = this.onAuthClose;
        window.plugins.childBrowser.onLocationChange = this.onAuthUrlChange;
    },

    onAuthClose: function () {
        console.log("Auth window closed");
    },

    onAuthUrlChange: function (uriLocation) {
        console.log("Auth window URL changed");

        if (uriLocation.indexOf("acs/token") != -1) {
            alert("that code");
            alert(amplify.store("tokenResponse"));
            window.plugins.childBrowser.close();
        }
    },

    listTodos: function () {
        remoteservices.getTodosEX(this.token)
            .done(function (data) {
                alert(data[0].title);
            });
    }
});
