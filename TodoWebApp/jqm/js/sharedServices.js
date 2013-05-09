angular.module('SharedServices', [])
    .config(function ($httpProvider) {
        $httpProvider.responseInterceptors.push('loadingIndicatorInterceptor');
        var spinnerFunction = function (data, headersGetter) {
            $.mobile.loading("show");

            return data;
        };
        $httpProvider.defaults.transformRequest.push(spinnerFunction);
    })
    .factory('loadingIndicatorInterceptor', function ($q, $window) {
        return function (promise) {
            return promise.then(
                function (response) {
                    $.mobile.loading("hide");

                    return response;
                }, function (response) {
                    $.mobile.loading("hide");

                    return $q.reject(response);
                });
        };
    });
