var dataServicesEvents = {
    error: "dataservices_error",
    action: "dataservices_action",
    endaction: "dataservices_endaction",
    dirty: "dataservices_dirty"
};

var dataservices = (function () {
    function handleServiceError(error) {
        console.log(error);

        if (error.status === 500) {
            $.publish(dataServicesEvents.error, "Kaboom!");
        } else if (error.status === 401) {
            $.publish(dataServicesEvents.error, "Login failed.");
        }
        else {
            $.publish(dataServicesEvents.error, error.statusText);
        }
    }

    function beforeLoginSend(xhr, un, pw) {
        xhr.setRequestHeader(httpSecurity.AuthorizationHeader, createBasicAuthenticationHeader(un, pw));
        $.publish(dataServicesEvents.action, "Login...");
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

        $.publish(dataServicesEvents.action, "Working...");
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

    function createLocal(key, item) {
        return $.Deferred(function (deferred) {
            item.isAdded = true;
            var data = amplify.store.sessionStorage(key);
            data.push(item);

            amplify.store.sessionStorage(key, data);
            $.publish(dataServicesEvents.dirty, key);

            deferred.resolve(item);
        }).promise();
    }

    function updateLocal(key, item) {
        return $.Deferred(function (deferred) {
            item.isUpdated = true;
            var data = amplify.store.sessionStorage(key);
            var oldItem = _.find(data, function (t) { return t.id === item.id; });
            var index = _.indexOf(data, oldItem);
            data.splice(index, 1, item);

            amplify.store.sessionStorage(key, data);
            $.publish(dataServicesEvents.dirty, key);

            deferred.resolve(item);
        }).promise();
    }

    function deleteLocal(key, id) {
        return $.Deferred(function (deferred) {
            item.isDeleted = true;
            var data = amplify.store.sessionStorage(key);
            var oldItem = _.find(data, function (t) { return t.id === id; });
            var index = _.indexOf(data, oldItem);
            data.splice(index, 1);

            amplify.store.sessionStorage(key, data);
            $.publish(dataServicesEvents.dirty, key);

            deferred.resolve();
        }).promise();
    }

    return {
        loginPing: function (url, un, pw) {
            return $.ajax({
                url: url,
                type: httpVerbs.GET,
                dataType: dataTypes.JSON,
                beforeSend: function (xhr) { beforeLoginSend(xhr, un, pw); }
            })
                .always(function () {
                    $.publish(dataServicesEvents.endaction);
                })
                .fail(function (error) {
                    handleServiceError(error);
                });
        },

        getList: function (service) {
            if (!navigator.onLine) {
                return getLocal(service);
            }
            else {
                return $.ajax({
                    url: service,
                    type: httpVerbs.GET,
                    dataType: dataTypes.JSON,
                    beforeSend: function (xhr) { beforeSend(xhr); },
                    timeout: 15000,
                    maxTries: 3,
                    retryCodes: [500]
                })
                    .always(function () {
                        $.publish(dataServicesEvents.endaction);
                    })
                    .success(function (data) {
                        amplify.store.sessionStorage(service, data);
                    })
                    .fail(function (error) {
                        handleServiceError(error);
                    });
            }
        },

        create: function (service, item) {
            if (!navigator.onLine) {
                return createLocal(service, item);
            }
            else {
                return $.ajax({
                    url: addConnectionIdParameter(service),
                    type: httpVerbs.POST,
                    dataType: dataTypes.JSON,
                    data: item,
                    beforeSend: function (xhr) { beforeSend(xhr); }
                })
                    .always(function () {
                        $.publish(dataServicesEvents.endaction);
                    })
                    .fail(function (error) {
                        handleServiceError(error);
                    });
            }
        },

        destroy: function (service, id) {
            if (!navigator.onLine) {
                return deleteLocal(service, id);
            }
            else {
                return $.ajax({
                    url: addConnectionIdParameter(service + id),
                    type: httpVerbs.DELETE,
                    dataType: dataTypes.JSON,
                    beforeSend: function (xhr) { beforeSend(xhr); }
                })
                    .always(function () {
                        $.publish(dataServicesEvents.endaction);
                    })
                    .fail(function (error) {
                        handleServiceError(error);
                    });
            }
        },

        update: function (service, item) {
            if (!navigator.onLine) {
                return updateLocal(service, item);
            }
            else {
                return $.ajax({
                    url: addConnectionIdParameter(service),
                    type: httpVerbs.PUT,
                    dataType: dataTypes.JSON,
                    data: item,
                    beforeSend: function (xhr) { beforeSend(xhr); }
                })
                    .always(function () {
                        $.publish(dataServicesEvents.endaction);
                    })
                    .fail(function (error) {
                        handleServiceError(error);
                    });
            }
        },

        sync: function (service) {
            return $.Deferred(function (deferred) {
                if (navigator.onLine) {
                    $.publish(dataServicesEvents.action, "Syncing...");

                    var items = amplify.store.sessionStorage(service);

                    if (items !== null) {
                        $.each(items, function (i, item) {
                            if (item.isDeleted) {
                                dataservices.destroy(service, item.id);
                            }
                            if (item.isAdded) {
                                // TODO: implement picture upload
                                dataservices.create(service, item);
                            }
                            if (item.isUpdated) {
                                dataservices.update(service, item);
                            }
                        });

                        amplify.store.sessionStorage(service, null);
                    }

                    $.publish(dataServicesEvents.endaction);
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
                
            }).promise();
        }
    };
}());
