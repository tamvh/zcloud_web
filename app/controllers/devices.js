angular.module('zcloud')
        .controller('DevicesCtrl', ['$scope', '$mdDialog', '$mdMedia', '$window', '$location', 'User', 'Devices',
            function ($scope, $mdDialog, $mdMedia, $window, $location, User, Devices) {
                if (!User.isLoggedIn()) {
                    $location.path('/login');
                    return;
                }

                var _devices;
                $scope.title = "Devices";
                $scope.activeDevice = null;
                
                $scope.init = function() {
                    sessionStorage.clear();
                   
                };
                $scope.init();

                $scope.action = function() {
                    alert('ffff');
                };
                
                $scope.showModal = function (selector) {
                    var deviceDetail = angular.element(selector);
                    deviceDetail.on('shown.bs.modal', function () {
                        // datetime picker
                        angular.element('#datetimepicker').datetimepicker();
                    });
                    deviceDetail.modal();
                };

                $scope.showCreateDeviceDialog = function (ev) {
                    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
                    $mdDialog.show({
                        controller: 'CreateDeviceDialogCtrl',
                        templateUrl: '/views/dialog.createdevice.tmpl.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: true,
                        fullscreen: useFullScreen
                    })
                            .then(function (answer) {
                                if (answer === "refresh") {
                                    $scope.device = null;
                                    $scope.devices = groupBy(_devices, 'group');
                                }
                            }, function () {
                                $scope.status = 'You cancelled the dialog.';
                            });
                    $scope.$watch(function () {
                        return $mdMedia('xs') || $mdMedia('sm');
                    }, function (wantsFullScreen) {
                        $scope.customFullscreen = (wantsFullScreen === true);
                    });
                };

                $scope.hideModal = function () {
                    angular.element('.modal').modal('hide');
                };

                $scope.createDevice = function () {
                    if (!$scope.device || !$scope.device.name || !$scope.device.address ||
                            !$scope.device.type || !$scope.device.group) {
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
                    Devices.query(function (devices) {
                        _devices = devices;
                        $scope.devices = groupBy(_devices, 'group');
                    }, function () {
                        $window.alert('Retrieve device list failed!');
                    });
                };

                $scope.addDevice = function () {
                    if (!$scope.device || !$scope.device.name || !$scope.device.group ||
                            !$scope.device.deviceid || !$scope.device.apikey) {
                        $window.alert('Device name, group, id and api key are required!');
                        return;
                    }

                    Devices.add({
                        name: $scope.device.name,
                        address: $scope.device.address,
                        group: $scope.device.group,
                        deviceid: $scope.device.deviceid,
                        apikey: $scope.device.apikey
                    }, function () {
                        $scope.hideModal();
                        $scope.device = null;
                        $scope.devices = groupBy($scope.device, 'group');
                    }, function () {
                        $window.alert('Add device failed! Please try again later.');
                    });
                };

                $scope.getDeviceInfo = function (device) {
                    $scope._deviceid = device.deviceid;
                    $scope._devicename = device.name;
                    $scope._deviceaddress = device.address;
                    $scope._groupname = device.group;
                    $scope.activeDevice = device;
                };

                $scope.showDevice = function (device, ev) {
                    $scope.activeDevice = device;
                    $scope.activeDevice.params = $scope.activeDevice.params || {};

                    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
                    $mdDialog.show({
                        controller: 'UpdateDeviceDialogCtrl',
                        templateUrl: '/views/dialog.updatedevice.tmpl.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        locals: {
                            device: $scope.activeDevice
                        },
                        clickOutsideToClose: true,
                        fullscreen: useFullScreen
                    })
                            .then(function (answer) {
                                if (answer === "refresh") {
                                    $scope.device = null;
                                    $scope.devices = groupBy(_devices, 'group');
                                }
                            }, function () {
                                $scope.status = 'You cancelled the dialog.';
                            });
                    $scope.$watch(function () {
                        return $mdMedia('xs') || $mdMedia('sm');
                    }, function (wantsFullScreen) {
                        $scope.customFullscreen = (wantsFullScreen === true);
                    });
                };

                $scope.saveDevice = function () {
                    if (!$scope.activeDevice || !$scope.activeDevice.name ||
                            !$scope.activeDevice.group) {
                        $window.alert('Device name and group are required!');
                        return;
                    }

                    $scope.activeDevice.$save(function (device) {
                        if (device.error) {
                            $window.alert(device.reason);
                            return;
                        }

                        $scope.devices = groupBy(_devices, 'group');
                    }, function () {
                        $window.alert('Save device failed! Please try again later.');
                    });
                };

                $scope.updateDevice = function (devicename, groupname) {
                    if (!$scope.activeDevice || !devicename || !groupname) {
                        $window.alert('Device name and group are required!');
                        return;
                    }
                    $scope.activeDevice.name = devicename;
                    $scope.activeDevice.group = groupname;
                    $scope.activeDevice.$save(function (device) {
                        if (device.error) {
                            $window.alert(device.reason);
                            return;
                        }

                        $scope.devices = groupBy(_devices, 'group');
                    }, function () {
                        $window.alert('Save device failed! Please try again later.');
                    });
                };

                $scope.deleteDevice = function (device) {
                    var confirm = $mdDialog.confirm()
                            .title('Delete confirmation')
                            .textContent('You really want to delete this device?')
                            .ok('Delete')
                            .cancel('Cancel');
                    $mdDialog
                            .show(confirm)
                            .then(function (answer) {
                                confirm = undefined;
                                console.log('You confirm delete the dialog.');

                                Devices.remove(device.deviceid, function () {
                                    $scope.devices = groupBy(_devices, 'group');
                                    $scope.activeDevice = null;
                                }, function () {
                                    $scope.alert('Delete device failed! Please try again later.');
                                });
                            }, function () {
                                confirm = undefined;
                                console.log('You cancelled the dialog.');
                            });
                };

                $scope.alert = function (message) {
                    var al = $mdDialog.alert()
                            .title('Information')
                            .textContent(message)
                            .ok('Close');
                    $mdDialog
                            .show(al)
                            .finally(function () {
                                al = undefined;
                            });
                };

                $scope.turnOn = function (device, property) {
                    update(device, property, 'on');
                };

                $scope.turnOff = function (device, property) {
                    update(device, property, 'off');
                };

                $scope.isDeviceOnline = function (device) {
                    if (!device || !isIndieDevice(device))
                        return false;

                    return device.online ? 'Device Online' : ' Device Offline';
                };

                $scope.addTimer = function (actionName) {
                    var timerAt = angular.element('#timerAt').val();
                    var timerAction = angular.element('#timerAction label.active input').val();
                    if (!timerAt || !timerAction) {
                        $window.alert('Please specify timer details!');
                        return;
                    }

                    var timer = {
                        enabled: true,
                        type: 'once',
                        at: (new Date(timerAt)).toISOString(),
                        do: {}
                    };
                    timer.do[actionName] = timerAction;

                    var timers = angular.extend([], $scope.activeDevice.params.timers || []);
                    timers.push(timer);
                    update($scope.activeDevice, 'timers', timers);
                };

                $scope.removeTimer = function (timer) {
                    var timers = angular.extend([], $scope.activeDevice.params.timers);
                    timers.splice(timers.indexOf(timer), 1);
                    update($scope.activeDevice, 'timers', timers);
                };

                var groupBy = function (input, property) {
                    if (!angular.isArray(input) || !angular.isString(property)) {
                        return input;
                    }

                    var group = {};

                    angular.forEach(input, function (item) {
                        var name = item[property];
                        if (!name) {
                            group['Default Group'] = group['Default Group'] || [];
                            group['Default Group'].push(item);
                            return;
                        }

                        group[name] = group[name] || [];
                        group[name].push(item);
                    });

                    return group;
                };

                var pending = null;
                var canSendReq = function (device) {
                    if (!isIndieDevice(device))
                        return true;

                    // if (! device.online) {
                    //   $window.alert('Device is offline, operation can not be performed!');
                    //   return false;
                    // }

                    if (!Object.keys(device).length) {
                        $window.alert('Device status is unknown, please wait for a moment.');
                        return false;
                    }

                    if (pending) {
                        $window.alert('Request in progress, please wait for a moment.');
                        return false;
                    }

                    return true;
                };

                var isIndieDevice = function (device) {
                    return true;
                    // return parseInt(device.deviceid.substr(2, 1), 16) >= 8;
                };

                var update = function (device, property, value) {
                    if (!canSendReq(device))
                        return;

                    pending = {params: {}};
                    pending.params[property] = value;

                    Devices.send({
                        action: 'update',
                        apikey: device.apikey,
                        deviceid: device.deviceid,
                        params: pending.params
                    }, function () {
                        $scope.$apply(function () {
                            angular.extend(device.params, pending.params);
                        });
                        pending = null;
                    }, function () {
                        $window.alert('Operation failed, please try again later.');
                        pending = null;
                    });
                };

//                Devices.init();
                Devices.query(function (devices) {
                    _devices = devices;
                    $scope.devices = groupBy(_devices, 'group');
                }, function () {
                    $window.alert('Retrieve device list failed!');
                });
                $scope.isDisabled = false;
            }
        ]);