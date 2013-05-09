angular.module('TodoService', ['ngResource'])
    .factory('Todo', ['$resource', '$http', function ($resource, $http) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $.base64.encode("cw" + ':' + "cw"); // yeah...

        var Todo = $resource('../../api/todos/:todoId', {}, {
            update: { method: 'PUT' }
        });
        return Todo;
}]);
