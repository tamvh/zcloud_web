angular.module('zcloud')
        .controller('CreateDeviceDialogCtrl', ['$scope', '$mdDialog', '$window', 'Devices',
            function ($scope, $mdDialog, $window, Devices) {
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
                $scope.createDevice = function () {
                    if (!$scope.device || !$scope.device.name || !$scope.device.address || !$scope.device.type || !$scope.device.group) {
                        $window.alert('Device name, address, type, and group are required!');
                        return;
                    }

                    Devices.save({
                        name: $scope.device.name,
                        address: $scope.device.address,
                        type: $scope.device.type,
                        group: $scope.device.group
                    }, function () {
                        $mdDialog.hide("refresh");
                    }, function () {
                        $window.alert('Create device failed! Please try again later.');
                    });
                };
            }
        ]);
