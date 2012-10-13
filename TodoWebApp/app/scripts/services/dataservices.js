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
        todosApp.Views.showLoader("Log in...");
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

        todosApp.Views.showLoader("Working...");
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

    function getLocal() {
        return $.Deferred(function (deferred) {
            var data = amplify.store.sessionStorage(localStorageKeys.TodosList);
            
            deferred.resolve(data);
        }).promise();
    }
    
    function saveLocal(item) {
        return $.Deferred(function (deferred) {
            item.isAdded = true;
            var data = amplify.store.sessionStorage(localStorageKeys.TodosList);
            data.push(item);

            amplify.store.sessionStorage(localStorageKeys.TodosList, data);

            deferred.resolve(item);
        }).promise();
    }

    function updateLocal(item) {
        return $.Deferred(function (deferred) {
            item.isUpdated = true;
            var data = amplify.store.sessionStorage(localStorageKeys.TodosList);
            var oldItem = _.find(data, function (t) { return t.id === item.id; });
            var index = _.indexOf(data, oldItem);
            data.splice(index, 1, item);
            
            amplify.store.sessionStorage(localStorageKeys.TodosList, data);

            deferred.resolve(item);
        }).promise();
    }
    
    function deleteLocal(id) {
        return $.Deferred(function (deferred) {
            item.isDeleted = true;
            var data = amplify.store.sessionStorage(localStorageKeys.TodosList);
            var oldItem = _.find(data, function (t) { return t.id === id; });
            var index = _.indexOf(data, oldItem);
            data.splice(index, 1);

            amplify.store.sessionStorage(localStorageKeys.TodosList, data);

            deferred.resolve();
        }).promise();
    }
    
    return {
        sync: function () {            
            todosApp.Views.showLoader("Syncing...");
            
            $.each(amplify.store.sessionStorage(localStorageKeys.TodosList), function (i, item) {
                if (item.isDeleted) {
                    dataservices.deleteTodo(item.id).done(function () { });
                }
                if (item.isAdded) {
                    // TODO: implement picture upload
                    dataservices.saveTodo(item).done(function () { });
                }
                if (item.isUpdated) {
                    dataservices.updateTodo(item).done(function () { });
                }
            });

            dataservices.getTodos();
            
            todosApp.Views.hideLoader();
        },
        
        callLoginPing: function (un, pw) {
            return $.ajax({
                url: endpoints.PingEndpointUrl,
                type: httpVerbs.GET,
                dataType: dataTypes.JSON,
                beforeSend: function (xhr) { beforeLoginSend(xhr, un, pw); }
            })
                .always(function () {
                    todosApp.Views.hideLoader();
                })
                .fail(function (error) {
                    handleServiceError(error);
                });
        },

        getTodos: function () {
            if (!navigator.onLine) {
                return getLocal();
            }
            else {
                return $.ajax({
                    url: addConnectionIdParameter(endpoints.ServiceEndpointUrl),
                    type: httpVerbs.GET,
                    dataType: dataTypes.JSON,
                    beforeSend: function (xhr) { beforeSend(xhr); }
                })
                    .always(function () {
                        todosApp.Views.hideLoader();
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
            if (!navigator.onLine) {
                return saveLocal(item);
            }
            else {
                return $.ajax({
                    url: addConnectionIdParameter(endpoints.ServiceEndpointUrl),
                    type: httpVerbs.POST,
                    dataType: dataTypes.JSON,
                    data: item,
                    beforeSend: function(xhr) { beforeSend(xhr); }
                })
                    .always(function() {
                        todosApp.Views.hideLoader();
                    })
                    .fail(function(error) {
                        handleServiceError(error);
                    });
            }
        },

        deleteTodo: function (id) {
            if (!navigator.onLine) {
                return deleteLocal(id);
            }
            else {
                return $.ajax({
                    url: addConnectionIdParameter(endpoints.ServiceEndpointUrl + id),
                    type: httpVerbs.DELETE,
                    dataType: dataTypes.JSON,
                    beforeSend: function(xhr) { beforeSend(xhr); }
                })
                    .always(function() {
                        todosApp.Views.hideLoader();
                    })
                    .fail(function(error) {
                        handleServiceError(error);
                    });
            }
        },

        updateTodo: function (item) {
            if (!navigator.onLine) {
                return updateLocal(item);
            }
            else {
                return $.ajax({
                    url: addConnectionIdParameter(endpoints.ServiceEndpointUrl),
                    type: httpVerbs.PUT,
                    dataType: dataTypes.JSON,
                    data: item,
                    beforeSend: function(xhr) { beforeSend(xhr); }
                })
                    .always(function() {
                        todosApp.Views.hideLoader();
                    })
                    .fail(function(error) {
                        handleServiceError(error);
                    });
            }
        }
    };
}());
