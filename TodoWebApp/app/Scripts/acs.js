var acsViewModel = kendo.observable({
    idpsSource: new kendo.data.DataSource(),

    getIdps: function () {
        var self = this;

        var staticAcsEndpoint = "http://localhost/Todo.WebApp/api/acs/getidps?ns=tttodos&realm=http%3A%2F%2Ftt.com%2Fmobile%2Ftodos";

        $.ajax({
            url: staticAcsEndpoint,
            type: 'get',
            dataType: 'json'
        })
        .done(function (data) {
            var idps = data;
            self.idpsSource.data(data);
        })
        .fail(function (error) {
            alert(error);
        });
    }
});
