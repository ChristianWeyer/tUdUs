var TodoApp = angular.module("TodoApp", ["ngResource"]).
    config(function ($routeProvider) {
        $routeProvider.
            when('/', { controller: ListController, templateUrl: 'list.html' }).
            when('/new', { controller: CreateController, templateUrl: 'detail.html' }).
            when('/edit/:itemId', { controller: EditController, templateUrl: 'detail.html' }).
            otherwise({ redirectTo: '/' });
    });

TodoApp.factory('Todo', function ($resource, $http) {
    // see http://blog.tomaka17.com/2012/12/random-tricks-when-using-angularjs/
    $http.defaults.headers.common['Authorization'] =
        'Basic ' + $.base64.encode("cw" + ':' + "cw"); // TODO: create login dialog

    return $resource('../../api/todos/:id', { id: '@id' }, { update: { method: 'PUT' } });
});