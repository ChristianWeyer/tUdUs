/// <reference path="../js/_references.js" />

var remoteservices = (function () {
    function handleServiceError(error) {
        console.log(error);

        if (error.status == "401") {
            errorViewModel.showErrorDialog("Login failed.");
        }
        else {
            errorViewModel.showErrorDialog(error.statusText);
        }
    }

    function beforeLoginSend(xhr, un, pw) {
        xhr.setRequestHeader('Authorization', createBasicAuthenticationHeader(un, pw));
        kendoMobileApplication.showLoading();
    }

    function beforeSend(xhr) {
        if (settingsViewModel.authenticationMode === "Basic") {
            xhr.setRequestHeader('Authorization', createBasicAuthenticationHeader(amplify.store.sessionStorage("userName"), amplify.store.sessionStorage("password")));
        }
        else {
            xhr.setRequestHeader('Authorization', createBearerHeader(amplify.store.sessionStorage("authenticationToken")));
        }

        kendoMobileApplication.showLoading();
    }

    function createBasicAuthenticationHeader(un, pw) {
        var header = 'Basic ' + $.base64.encode(un + ":" + pw);
        return header;
    }

    function createBearerHeader(token) {
        var header = 'Bearer ' + token;
        return header;
    }

    function addConnectionIdParameter(url) {
        return addParameter(url, "connectionId", $.connection.hub.id)
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
        callLoginPing: function (un, pw) {
            return $.ajax({
                url: pingEndpointUrl,
                type: 'get',
                dataType: 'json',
                beforeSend: function (xhr) { beforeLoginSend(xhr, un, pw); }
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
                url: addConnectionIdParameter(serviceEndpointUrl),
                type: 'get',
                dataType: 'json',
                beforeSend: function (xhr) { beforeSend(xhr); }
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
                url: addConnectionIdParameter(serviceEndpointUrl),
                type: 'post',
                dataType: 'json',
                data: item,
                beforeSend: function (xhr) { beforeSend(xhr); }
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
                url: addConnectionIdParameter(serviceEndpointUrl + "/" + id),
                type: 'delete',
                dataType: 'json',
                beforeSend: function (xhr) { beforeSend(xhr); }
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
                url: addConnectionIdParameter(serviceEndpointUrl),
                type: 'put',
                dataType: 'json',
                data: item,
                beforeSend: function (xhr) { beforeSend(xhr); }
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
