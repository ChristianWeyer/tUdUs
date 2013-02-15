var EditController = function ($scope, $routeParams, $location, Todo) {
    $scope.item = Todo.get({ id: $routeParams.itemId });
    $scope.action = "Edit";

    $scope.save = function () {
        Todo.update({ id: $scope.item.TodoItemId }, $scope.item, function () {
            $location.path('/');
        });
    };
};
