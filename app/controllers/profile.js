angular.module('zcloud').
  controller('ProfileCtrl', ['$scope', '$window', '$location', 'User',
    function ($scope, $window, $location, User) {
      if (!User.isLoggedIn()) {
        $location.path('/login');
        return;
      }
      $scope.title = "Profile";

      $scope.getEmail = function () {
        return User.getUser().email;
      };

      var isActive = User.isActive();
      $scope.isDisabled = !isActive;

     $scope.getApikey = function () {
       return User.getUser().apikey;
     };
     
     $scope.getToken = function () {
       return User.getToken();
     };

    }
  ]);