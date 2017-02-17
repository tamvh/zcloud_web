angular.module('zcloud').
  controller('PageContentCtrl', [ '$scope', '$mdSidenav', '$controller',
    function ($scope, $mdSidenav, $controller) {
      $scope.toggleSidenav = function(menuId) {
        $mdSidenav(menuId).toggle();
      };

	  // angular.extend(this, $controller('MainCtrl', {$scope: $scope}));      
    }
  ]);