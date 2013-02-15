var ListController = function ($scope, $location, Todo) {
    $scope.top = 20;
    $scope.sortOrder = 'desc';
    $scope.orderBy = 'Created';

    $scope.search = function () {
        // Consider using OQuery: http://code.msdn.microsoft.com/oquery
        var filterQuery = "true";

        if ($scope.query) {
            filterQuery = "substringof('{0}',Title)".replace('{0}', $scope.query);
        }

        Todo.query({ $filter: filterQuery, $top: $scope.top, $skip: $scope.skip, $orderby: $scope.orderBy + " " + $scope.sortOrder },
            function (items) {
                var cnt = items.length;
                $scope.noMore = cnt < $scope.top;
                $scope.items = $scope.items.concat(items);
            }
        );
    };

    $scope.showMore = function () {
        return !$scope.noMore;
    };

    $scope.page = function () {
        $scope.skip = $scope.skip + $scope.top;
        $scope.search();
    };
    
    $scope.sortBy = function (ord) {
        if ($scope.orderBy == ord) {
            if ($scope.sortOrder == 'desc') {
                $scope.sortOrder = 'asc';
            } else {
                $scope.sortOrder = 'desc';
            }
        }
        
        $scope.orderBy = ord;
        $scope.reset();
    };
    
    $scope.delete = function () {
        var itemId = this.item.id;
        
        Todo.delete({ id: itemId }, function () {
            $("#item_" + itemId).fadeOut();
        });
    };
    
    $scope.reset = function () {
        $scope.skip = 0;
        $scope.items = [];
        $scope.search();
    };

    $scope.reset();
};
