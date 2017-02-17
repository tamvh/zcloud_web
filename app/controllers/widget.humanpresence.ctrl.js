(function () {
    angular
            .module('zcloud')
            .controller('WidgetHumanPresenceController', ['$scope', 'Devices',
                WidgetHumanPresenceController
            ]);

    function WidgetHumanPresenceController($scope, Devices) {
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
            if (data.value === '0') {
                vm.deviceValue = "No person";
            } else {
                vm.deviceValue = "Have human presence";
            }
            if (vm.device.localTime === "") {
                vm.localTime = "undefined";
            } else {
                var timestamp = new Date(vm.device.localTime * 1000);
                vm.localTime = timestamp.toLocaleDateString() + ' ' + timestamp.toLocaleTimeString();
            }

            vm.typeImg = data.value + "_" + vm.widget.type;
            console.log("Device value updated:", vm.deviceValue);
        });

        Devices.get(vm.widget.device_id, function (device) {
            console.log("Device:", device);
            vm.device = device;
            if (vm.device.value === '0') {
                vm.deviceValue = "No person";
            } else {
                vm.deviceValue = "Have human presence";
            }
            if (vm.device.localTime === "") {
                vm.localTime = "undefined";
            } else {
                var timestamp = new Date(vm.device.localTime * 1000);
                vm.localTime = timestamp.toLocaleDateString() + ' ' + timestamp.toLocaleTimeString();
            }
            vm.typeImg = vm.device.value + "_" + vm.widget.type;
            console.log("Device value:", vm.deviceValue);
        });
    }
})();
