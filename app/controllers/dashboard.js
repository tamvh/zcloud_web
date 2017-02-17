angular.module('zcloud')
        .controller('DashboardCtrl',
                ['$scope', '$window', '$location', '$interval', '$cookies', '$mdDialog', '$mdMedia', 'User', 'Devices', 'WS', 'Widgets', 'Dashboard',
                    function ($scope, $window, $location, $interval, $cookies, $mdDialog, $mdMedia, User, Devices, WS, Widgets, Dashboard) {

                        if (!User.isLoggedIn()) {
                            $location.path('/login');
                            return;
                        }
                        var _devices;
                        var _widgets;
                        $scope.data = {
                            devices: []
                        };
                        $scope.title = "Dashboard";

                        var deviceName = '';
                        var widgetType = '';
                        $scope.defaultWidgets = [];
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

                        $scope.init = function ()
                        {
                            Dashboard.init();
                            
                            $scope.username = User.getUser().email;
                            Devices.query(function (devices) {
                                _devices = devices;
                                $scope.data.devices = _devices;
                                $scope.totaldevices = _devices.length;

                                var obj_device = groupBy(_devices, 'group');
                                var output = [], item;

                                for (var type in obj_device) {
                                    item = {};
                                    item.type = type;
                                    item.name = obj_device[type];
                                    output.push(item);
                                }
                                $scope.totalgroups = output.length;
                            }, function () {
                                $window.alert('Retrieve device list failed!');
                            });

                            Widgets.query(function (widgets) {
                                _widgets = widgets;
                                $scope.widgets = _widgets;                                
                                $scope.totalwidgets = $scope.widgets.length;
                            }, function () {
                                $window.alert('Retrieve device list failed!');
                            });
                        };



                        $scope.init();

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

                        $scope.createWidget = function () {
                            if (!$scope.widget || !$scope.widget.deviceId || !$scope.widget.size) {
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

                        $scope.showAddWidget = function (ev) {
                            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
                            $mdDialog.show({
                                controller: 'AddWidgetDialogCtrl',
                                templateUrl: '/views/dialog.addwidget.tmpl.html',
                                parent: angular.element(document.body),
                                targetEvent: ev,
                                clickOutsideToClose: true,
                                fullscreen: useFullScreen
                            })
                                    .then(function (answer) {
                                        if (answer === "refresh") {
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
                    }
                ]);

