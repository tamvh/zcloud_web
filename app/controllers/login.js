angular.module('zcloud').
        controller('LoginCtrl', ['$scope', '$window', '$location', 'User',
            function ($scope, $window, $location, User) {
                $scope.init = function () {
                    
                };
                $scope.init();
                $scope.login = function () {
                    User.login($scope.email, $scope.password, function (err, user) {
                        if (err) {
                            $window.alert(err);
                            return;
                        }
//                        $location.path('/dashboard');
                        window.location.href='/dashboard';
                        $window.location.reload();
                    });
                    
                };
            }
        ]);