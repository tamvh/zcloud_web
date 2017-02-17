angular.module('zcloud').
  controller('IndexCtrl', [ '$scope', '$mdSidenav',
    function ($scope, $mdSidenav) {
      $scope.toggleSidenav = function(menuId) {
        $mdSidenav(menuId).toggle();
      };
      $scope.slides = [{
        href: 'https://github.com/itead/IoTgo',
        src: '/images/home/slideshow/iot.jpg'
      }, {
        href: 'https://www.indiegogo.com/projects/iotgo-open-source-iot-cloud-solution',
        src: '/images/home/slideshow/indiegogo.jpg'
      }];
    }
  ]);