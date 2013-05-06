var module1 = angular.module('TodoService', ['ngResource']).factory('Todo', ['$resource', '$http', function ($resource, $http) {
    // see http://blog.tomaka17.com/2012/12/random-tricks-when-using-angularjs/
    $http.defaults.headers.common['Authorization'] =
        'Basic ' + $.base64.encode("cw" + ':' + "cw"); // TODO: create/show login dialog
    
    var Todo = $resource('../../api/todos/:todoId', {}, {
        update: { method: 'PUT'}
    });
    return Todo;
}]);