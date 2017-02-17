angular.module('zcloud')
        .controller('UpdateWidgetDialogCtrl', ['$scope', '$mdDialog', '$window', 'Devices', 'Widgets', 'widget',
            function ($scope, $mdDialog, $window, Devices, Widgets, widget) {
                $scope.widget = widget;
                $scope.data = {
                    devices: []
                };

                $scope.widget.deviceId = '';
                $scope.init = function () {
                    var device_id = $scope.widget.device_id;
                    Devices.query(function (devices) {
                        $scope.data.devices = devices;
                        Devices.get(device_id, function (device) {
                            $scope.params = device.params;
                        });
                    }, function () {
                        console.log("cannot query devices");
                    });
                    $scope.widget.deviceId = device_id;
                };
                $scope.init();

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
                $scope.saveWidget = function () {
                    $scope.widget.device_id = $scope.widget.deviceId;
                    if (!$scope.widget || !$scope.widget.name ||
                            !$scope.widget.device_id) {
                        $window.alert('Widget name and device are required!');
                        return;
                    }

                    Widgets.save($scope.widget, function (widget) {
                        if (widget !== undefined && widget.error) {
                            $window.alert(widget.reason);
                            return;
                        }

                        $mdDialog.hide("refresh");
                    }, function () {
                        $window.alert('Save widget failed! Please try again later.');
                    });
                };

                $scope.deleteWidget = function () {
                    if (!$window.confirm('You really want to delete this widget?')) {
                        return;
                    }

                    Widgets.remove(
                            $scope.widget.id
                            , function () {
                                $mdDialog.hide("refresh");
                            }, function () {
                        $window.alert('Delete widget failed! Please try again later.');
                    });                                                            
                };
                
                $scope.selectDevice = function () {
                    var deviceId = $scope.widget.deviceId;
                    Devices.get(deviceId, function (device) {
                        $scope.params = device.params;
                    });

                };
            }
        ]);
