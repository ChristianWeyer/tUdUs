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

    return {
        callLoginPing: function (un, pw) {
            return $.ajax({
                url: pingEndpointUrl,
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
                url: serviceEndpointUrl,
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
                url: serviceEndpointUrl,
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
                url: serviceEndpointUrl + "/" + id,
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
                url: serviceEndpointUrl,
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
