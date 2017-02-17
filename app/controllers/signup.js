angular.module('zcloud').
        controller('SignupCtrl', ['$scope', '$window', '$location', 'User',
            function ($scope, $window, $location, User) {
                $scope.register = function () {
                    User.register($scope.email, $scope.password, $scope.response, function (err) {
                        if (err) {
                            $window.alert(err);
                            return;
                        }
                        else {
                            User.login($scope.email, $scope.password, function (err, user) {
                                if (err) {
                                    $window.alert(err);
                                    return;
                                }
                                $location.path('/login');
                            });
                        }
                    });
                };
            }
        ]);
