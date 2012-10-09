var dataservices = (function () {
    function handleServiceError(error) {
        console.log(error);

        if (error.status === 401) {
            errorViewModel.showErrorDialog("Login failed.");
        }
        else {
            errorViewModel.showErrorDialog(error.statusText);
        }
    }

    function beforeLoginSend(xhr, un, pw) {
        xhr.setRequestHeader(httpSecurity.AuthorizationHeader, createBasicAuthenticationHeader(un, pw));
        kendoMobileApplication.showLoading();
    }

    function beforeSend(xhr) {
        if (settingsViewModel.authenticationMode === authenticationModes.Basic) {
            xhr.setRequestHeader(httpSecurity.AuthorizationHeader, createBasicAuthenticationHeader(
                amplify.store.sessionStorage(localStorageKeys.UserName), amplify.store.sessionStorage(localStorageKeys.Password)));
        }
        else {
            xhr.setRequestHeader(httpSecurity.AuthorizationHeader, createBearerHeader(
                amplify.store.sessionStorage(localStorageKeys.AuthenticationToken)));
        }

        kendoMobileApplication.showLoading();
    }

    function createBasicAuthenticationHeader(un, pw) {
        var header = httpSecurity.BasicAuthenticationScheme + $.base64.encode(un + ":" + pw);
        return header;
    }

    function createBearerHeader(token) {
        var header = httpSecurity.BearerAuthenticationScheme + token;
        return header;
    }

    function addConnectionIdParameter(url) {
        return addParameter(url, "connectionId", $.connection.hub.id);
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

    function getLocal(key) {
        return $.Deferred(function (deferred) {            
            var data = amplify.store.sessionStorage(key);
            deferred.resolve(data);
        }).promise();
    }

    return {
        callLoginPing: function (un, pw) {
            return $.ajax({
                url: endpoints.PingEndpointUrl,
                type: httpVerbs.GET,
                dataType: dataTypes.JSON,
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
            if (!navigator.onLine) {
                return getLocal(localStorageKeys.TodosList);
            }
            else {
                return $.ajax({
                    url: addConnectionIdParameter(endpoints.ServiceEndpointUrl),
                    type: httpVerbs.GET,
                    dataType: dataTypes.JSON,
                    beforeSend: function (xhr) { beforeSend(xhr); }
                })
                    .always(function () {
                        kendoMobileApplication.hideLoading();
                    })
                    .success(function (data) {
                        amplify.store.sessionStorage(localStorageKeys.TodosList, data);
                    })
                    .fail(function (error) {
                        handleServiceError(error);
                    });
            }
        },

        saveTodo: function (item) {
            return $.ajax({
                url: addConnectionIdParameter(endpoints.ServiceEndpointUrl),
                type: httpVerbs.POST,
                dataType: dataTypes.JSON,
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
                url: addConnectionIdParameter(endpoints.ServiceEndpointUrl + id),
                type: httpVerbs.DELETE,
                dataType: dataTypes.JSON,
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
                url: addConnectionIdParameter(endpoints.ServiceEndpointUrl),
                type: httpVerbs.PUT,
                dataType: dataTypes.JSON,
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
    };
}());
