angular.module('zcloud')
.controller('UpdateDeviceDialogCtrl', [ '$scope', '$mdDialog', '$window', 'Devices', 'device',
  function ($scope, $mdDialog, $window, Devices, device) {
    $scope.activeDevice = device;
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.closeDialog = function() {
      $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };
    $scope.saveDevice = function () {
      if (! $scope.activeDevice || 
              ! $scope.activeDevice.name ||
              ! $scope.activeDevice.group) {
        $window.alert('Device name and group are required!');
        return;
      }

      $scope.activeDevice.$save(function (device) {
        if (device.error) {
          $window.alert(device.reason);
          return;
        }

        $mdDialog.hide("refresh");
      }, function () {
        $window.alert('Save device failed! Please try again later.');
      });
      
      
//       Devices.update($scope.activeDevice, function () {
//         $mdDialog.hide("refresh");
//       }, function () {
//         $window.alert('Save device failed! Please try again later.');
//       });
    };

    $scope.deleteDevice = function () {
      if (! $window.confirm('You really want to delete this device?')) {
        return;
      }

      Devices.remove($scope.activeDevice.deviceid, function () {
        $mdDialog.hide("refresh");
      }, function () {
        $window.alert('Delete device failed! Please try again later.');
      });
    };
  }
]);
