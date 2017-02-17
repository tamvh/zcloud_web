angular.module('zcloud')
  .controller('AddWidgetDialogCtrl', ['$scope', '$mdDialog', '$window', 'Widgets', 'Devices',
    function ($scope, $mdDialog, $window, Widgets, Devices) {

      var deviceName = '';
      var widgetType = '';
      $scope.data = {
        devices: []
      };
      $scope.init = function () {
        Devices.query(function (devices) {
          $scope.data.devices = devices;
        }, function() {
          console.log("cannot query devices");
        });
      };
      $scope.init();

      $scope.widget = {
        type: 1
      };


      $scope.hide = function () {
        $mdDialog.hide();
      };
      $scope.cancel = function () {
        $mdDialog.cancel();
      };
      $scope.closeDialog = function () {
        $mdDialog.cancel();
      };
      $scope.answer = function (answer) {
        $mdDialog.hide(answer);
      };
      $scope.addWidget = function () {
        if (!$scope.widget || !$scope.widget.deviceId){
          $window.alert('Widget settings are required!');
          return;
        }
        
        Widgets.add({
          device_id: $scope.widget.deviceId,
          type: widgetType,
          name: $scope.widget.name,
          size: $scope.widget.size
        }, function () {
          $mdDialog.hide("refresh");
        }, function () {
          $window.alert('Add widget failed! Please try again later.');
        });

      };
      
      $scope.selectWidget = function() {
          //do something
          
      };
      
      $scope.selectDevice = function () {
        var deviceItem;
        var deviceId = $scope.widget.deviceId;
        Devices.get(deviceId, function (device) {
          deviceItem = device;
          deviceName = deviceItem.name;
          widgetType = deviceItem.type;
          if ($scope.widget.name === undefined ||
              $scope.widget.name === "") {
            $scope.widget.name = deviceName;
          }
        });
      };
    }
  ]);
