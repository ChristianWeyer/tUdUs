TodoApp.directive('sorted', function () {
    return {
        scope: true,
        transclude: true,
        template: '<a ng-click="doSort()" ng-transclude></a>' +
            '<span ng-show="doShow(\'asc\')"><i class="icon-circle-arrow-down"></i></span>' +
            '<span ng-show="doShow(\'desc\')"><i class="icon-circle-arrow-up"></i></span>',

        controller: function ($scope, $element, $attrs) {
            $scope.sort = $attrs.sorted;

            $scope.doSort = function() {
                 $scope.sortBy($scope.sort);
            };
            
            $scope.doShow = function (ord, col) {
                return (ord != $scope.sortOrder) && ($scope.orderBy == $scope.sort);
            };
        }
    };
});