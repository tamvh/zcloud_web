angular.module('zcloud')
        .controller('NavSearch', ['$scope', '$cookies', 'User', 'Search', '$location', 
            function ($scope, $cookies, User, Search, $location) {
                if (!User.isLoggedIn()) {
                    $location.path('/login');
                    return;
                }
                $scope.key = $cookies.get('keysearch');
            }
        ]);
  