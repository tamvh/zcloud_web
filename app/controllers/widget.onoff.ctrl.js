(function () {
  angular
          .module('zcloud')
          .controller('WidgetOnOffController', ['$scope', 'Devices',
            WidgetOnOffController
          ]);

  function WidgetOnOffController($scope, Devices) {
    var vm = this;

    vm.widget = $scope.$parent.widget;
    vm.device = {};
    vm.deviceValue = undefined;   

    vm.getValue = function () {
      if (vm.device.params === undefined) {
        return undefined;
      }
      for (var i = 0; i < vm.device.params.length; i++) {
        var pVar = vm.device.params[i];
        if (pVar.varId === vm.widget.variable_id) {
          return pVar.value;
        }
      }
      return undefined;
    };

    console.log("Register scope: ", 'DEVICE_DATA_UPDATE_' + vm.widget.device_id);
    $scope.$on('DEVICE_DATA_UPDATE_' + vm.widget.device_id, function (event, data) {
      vm.device.value = vm.device.value || {};
      angular.extend(vm.device.value, data.value);
      vm.deviceValue = data.value;
      vm.typeImg = vm.deviceValue + "_" + vm.widget.type;
      console.log("Device value updated:", vm.deviceValue);
    });

    Devices.get(vm.widget.device_id, function (device) {
      console.log("Device:", device);
      vm.device = device;
      vm.deviceValue = vm.device.value;
      vm.typeImg = vm.deviceValue + "_" + vm.widget.type;
      console.log("Device value:", vm.deviceValue);
    });   
  }
})();
