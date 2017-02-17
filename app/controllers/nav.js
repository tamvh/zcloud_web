angular.module('zcloud')
        .controller('NavCtrl', ['$scope', 'User', '$location', '$cookies', 
            function ($scope, User, $location, $cookies) {
                $scope.isLoggedIn = User.isLoggedIn();
                $scope.useremail = User.getUser().email;
                if ($scope.isLoggedIn) {
                    $scope.menu = [
                        {
                            title: "Dashboard",
                            link: "#/dashboard",
                            icon: "dashboard"
                        },
                        {
                            title: "Devices",
                            link: "#/devices",
                            icon: "dashboard"
                        },
                        {
                            title: "Profile",
                            link: "#/profile",
                            icon: "dashboard"
                        },
                        {
                            title: "About",
                            link: "#/about",
                            icon: "dashboard"
                        },
                        {
                            title: "Logout",
                            link: "#/login",
                            icon: "dashboard"
                        }
                    ];

                } else {

                    $scope.isLock = "";
                    $scope.menu = [
                        {
                            title: "Log in",
                            link: "#/login",
                            icon: "dashboard"
                        },
                        {
                            title: "Signup",
                            link: "#/signup",
                            icon: "dashboard"
                        }
                    ];
                }                
            }
        ]);
  