angular.module('zcloud').
        controller('MainCtrl', ['$scope', '$mdSidenav', 'User', '$location', '$window', '$cookies', 
            function ($scope, $mdSidenav, User, $location, $window, $cookies) {
                $scope.toggleSidenav = function (menuId) {
                    $mdSidenav(menuId).toggle();
                };
                $scope.login = function() {
                    User.login($scope.email, $scope.password, function (err, user) {
                        if (err) {
                            $window.alert('Login error');
                            return;
                        }
                        
                    }); 
                    $scope.showlogin = true;
                    $location.path('/dashboard');          
                    $window.location.reload();
                };
                
                $scope.logout = function() {
                    User.logout();   
                    $scope.style = '';
                    $location.path('/login');
                    $window.location.reload();
                };
                $scope.search = function() {
                    $cookies.put('keysearch', $scope.key);
                    $location.path('/search');
                };
                $scope.init = function () {
                    if (!User.isLoggedIn()) {
                        $scope.style = '';
                        $scope.showlogin = false;    
                        $location.path('/login');
                    }    
                    else {
                        $scope.style = 'sidebar-l sidebar-o side-scroll header-navbar-fixed sidebar-mini';
                        $scope.showlogin = true;  
                        var url = window.location.href.split('#/')[1];
                        if(url === 'dashboard' || url === 'login')
                            $location.path('/dashboard');  
                    }
                    
                };
                $scope.init();
            }
        ]);