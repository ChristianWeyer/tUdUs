/// <reference path="../js/_references.js" />

var remoteservices = (function () {
    function handleServiceError(data) {
        if (data.status == "401") {
            errorViewModel.showErrorDialog("Login failed.");
        }
        else {
            errorViewModel.showErrorDialog(data.statusText);
        }
    }

    function beforeSend(xhr, un, pw) {
        xhr.setRequestHeader('Authorization', createBasicAuthenticationHeader(un, pw));
        kendoMobileApplication.showLoading();
    }

    function beforeSendEX(xhr, token) {
        xhr.setRequestHeader('Authorization', createXYZHeader(token));
        kendoMobileApplication.showLoading();
    }

    function createBasicAuthenticationHeader(un, pw) {
        var header = 'Basic ' + $.base64.encode(un + ":" + pw);
        return header;
    }

    function createXYZHeader(token) {
        var header = 'Bearer ' + token;
        return header;
    }

    function addParameter(url, param, value) {
        var val = new RegExp('(\\?|\\&)' + param + '=.*?(?=(&|$))'),
            qstring = /\?.+$/;

        if (val.test(url)) {
            return url.replace(val, '$1' + param + '=' + value);
        }
        else if (qstring.test(url)) {
            return url + '&' + param + '=' + value;
        }
        else {
            return url + '?' + param + '=' + value;
        }
    }

    return {
        getTodosEX: function (token) {
            return $.ajax({
                url: serviceEndpointUrl,
                type: 'get',
                dataType: 'json',
                beforeSend: function (xhr) { beforeSendEX(xhr, token); }
            })
            .always(function () {
                kendoMobileApplication.hideLoading();
            })
            .fail(function (error) {
                handleServiceError(error);
            });
        },

        callLoginPing: function (un, pw) {
            return $.ajax({
                url: addParameter(pingEndpointUrl, "connectionId", $.connection.hub.id),
                type: 'get',
                dataType: 'json',
                beforeSend: function (xhr) { beforeSend(xhr, un, pw); }
            })
            .always(function () {
                kendoMobileApplication.hideLoading();
            })
            .fail(function (error) {
                handleServiceError(error);
            });
        },

        getTodos: function () {
            return $.ajax({
                url: addParameter(serviceEndpointUrl, "connectionId", $.connection.hub.id),
                type: 'get',
                dataType: 'json',
                beforeSend: function (xhr) { beforeSend(xhr, amplify.store("userName"), amplify.store("password")); }
            })
            .always(function () {
                kendoMobileApplication.hideLoading();
            })
            .fail(function (error) {
                handleServiceError(error);
            });
        },

        saveTodo: function (item) {
            return $.ajax({
                url: addParameter(serviceEndpointUrl, "connectionId", $.connection.hub.id),
                type: 'post',
                dataType: 'json',
                data: item,
                beforeSend: function (xhr) { beforeSend(xhr, amplify.store("userName"), amplify.store("password")); }
            })
            .always(function () {
                kendoMobileApplication.hideLoading();
            })
            .fail(function (error) {
                handleServiceError(error);
            });
        },

        deleteTodo: function (id) {
            return $.ajax({
                url: addParameter(serviceEndpointUrl + "/" + id, "connectionId", $.connection.hub.id),
                type: 'delete',
                dataType: 'json',
                beforeSend: function (xhr) { beforeSend(xhr, amplify.store("userName"), amplify.store("password")); }
            })
            .always(function () {
                kendoMobileApplication.hideLoading();
            })
            .fail(function (error) {
                handleServiceError(error);
            });
        },

        updateTodo: function (item) {
            return $.ajax({
                url: addParameter(serviceEndpointUrl, "connectionId", $.connection.hub.id),
                type: 'put',
                dataType: 'json',
                data: item,
                beforeSend: function (xhr) { beforeSend(xhr, amplify.store("userName"), amplify.store("password")); }
            })
            .always(function () {
                kendoMobileApplication.hideLoading();
            })
            .fail(function (error) {
                handleServiceError(error);
            });
        }
    }
} ());
