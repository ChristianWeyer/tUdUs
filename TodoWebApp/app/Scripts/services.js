/// <reference path="../js/_references.js" />

var requests = (function () {
    function handleServiceError(data) {
        if (data.status == "401") {
            alert('Login failed.');
        }
        else {
            alert('Error: ' + data.statusText);
        }
    }

    function beforeSend(xhr, un, pw) {        
        xhr.setRequestHeader('Authorization', createBasicAuthenticationHeader(un, pw));
        kendoMobileApplication.showLoading();
    };

    function createBasicAuthenticationHeader(un, pw) {
        var header = 'Basic ' + $.base64.encode(un + ":" + pw);
        return header;
    }

    function addParameter(url, param, value) {
        // Using a positive lookahead (?=\=) to find the
        // given parameter, preceded by a ? or &, and followed
        // by a = with a value after than (using a non-greedy selector)
        // and then followed by a & or the end of the string
        var val = new RegExp('(\\?|\\&)' + param + '=.*?(?=(&|$))'),
        qstring = /\?.+$/;

        // Check if the parameter exists
        if (val.test(url)) {
            // if it does, replace it, using the captured group
            // to determine & or ? at the beginning
            return url.replace(val, '$1' + param + '=' + value);
        }
        else if (qstring.test(url)) {
            // otherwise, if there is a query string at all
            // add the param to the end of it
            return url + '&' + param + '=' + value;
        }
        else {
            // if there's no query string, add one
            return url + '?' + param + '=' + value;
        }
    }

    return {
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
                url: addParameter(serviceEndpointUrl + "/" + id, "connectionId", $.connection.hub.id),
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
