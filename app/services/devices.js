angular.module('zcloud')
        .factory('Devices', ['$resource', '$window', '$rootScope', 'Settings', 'WS', 'User', '$cookies',
            function ($resource, $window, $rootScope, Settings, WS, User, $cookies) {
                var Resource = $resource(Settings.httpServer + '/api/user/device/:id', {id: '@deviceid'}, {
                    add: {method: 'POST', url: Settings.httpServer + '/api/user/device/add'}
                });
                var Resource_History = $resource(Settings.httpServer + '/api/user/device/history/:deviceid/:count', {deviceid: '@deviceid', count: 'count'});

                var _devices = [], _indexes = {}, _historys = [];
                var _listenWebSocketRegister = false;
                var _history = function (count, deviceid, successCallback, errorCallback) {
                    Resource_History.query({deviceid: deviceid, count: count}, function (history) { 
                        _historys = history;                                                
                        successCallback(_historys);
                    }, errorCallback);
                };

                var _query = function (successCallback, errorCallback) {

                    //if (_devices) {
                    //    successCallback(_devices);
                    //    return;
                    //}

                    Resource.query(function (devices) {
                        _devices = devices;
                        angular.forEach(_devices, function (_device) {
                            _indexes[_device.deviceid] = _device;
                        });

                        successCallback(_devices);
                    }, errorCallback);
                };

                var _getValue = function (deviceId, successCallback, errorCallback) {
                    var _device = _indexes[deviceId];

                    _listenWebSocket();
                    if (_device) {
                        successCallback(_device.params);
                        return;
                    }

                };

                var _get = function (deviceId, successCallback, errorCallback) {
                    var _device = _indexes[deviceId];
                    if (_device) {
                        successCallback(_device);
                        return;
                    }

                    Resource.get({id: deviceId}, function (device) {
                        _device = device;
                        _devices.push(device);
                        _indexes[deviceId] = _device;
                        successCallback(_device);
                    }, function () {
                        errorCallback();
                    });
                };

                var _remove = function (deviceId, successCallback, errorCallback) {
                    var _device = _indexes[deviceId];
//                    var rc = $resource(Settings.httpServer + '/api/user/device/:address', {address: '@address'});
//                    if (_device) {
//                        rc.remove({address: _device.address}, function (device) {
//                            if (device.error) {
//                                errorCallback();
//                                return;
//                            }
//
//                            _devices.splice(_devices.indexOf(_device), 1);
//                            delete _indexes[deviceId];
//                            successCallback(_device);
//                        }, errorCallback);
//                        return;
//                    }

                    if (_device) {
                        _device.$remove(function (device) {
                            if (device.error) {
                                errorCallback();
                                return;
                            }

                            _devices.splice(_devices.indexOf(_device), 1);
                            delete _indexes[deviceId];
                            successCallback(_device);
                        }, errorCallback);

                        return;
                    }

                    errorCallback();
                };

                var _add = function (deviceData, successCallback, errorCallback) {
                    Resource.add(deviceData, function (device) {
                        if (device.error) {
                            errorCallback();
                            return;
                        }

                        _devices.push(device);
                        _indexes[device.deviceid] = device;

                        successCallback(device);
                    }, errorCallback);
                };

                var _update = function (deviceData, successCallback, errorCallback) {
                    var _device = _indexes[deviceData.deviceid];
                    var rc = $resource(Settings.httpServer + '/api/user/device/:address', {address: '@address'});
                    if (_device) {
                        rc.save({address: _device.address}, deviceData, function (device) {
                            if (device.error) {
                                errorCallback();
                                return;
                            }
                            _indexes[device.deviceid] = device;

                            successCallback(device);
                        }, errorCallback);
                        return;
                    }
                };

                var _save = function (deviceData, successCallback, errorCallback) {
                    Resource.save(deviceData, function (device) {
                        if (device.error) {
                            errorCallback();
                            return;
                        }

                        _devices.push(device);
                        _indexes[device.deviceid] = device;

                        successCallback(device);
                    }, errorCallback);
                };

                var _pending = {};

                var _send = function (data, successCallback, errorCallback) {
                    if (!angular.isObject(data)) {
                        return;
                    }

                    data.sequence = '' + Date.now();
                    _pending[data.sequence] = {
                        success: successCallback,
                        error: errorCallback
                    };

                    WS.send(data);
                };

                var _init = function () {
                    _listenWebSocket();
                };

                var _listenWebSocket = function () {
                    if (_listenWebSocketRegister) {
                        return;
                    }
                    _listenWebSocketRegister = true;
                    WS.addListener(function (data) {
                        // request

                        console.log("receive data from WS:", data);
                        if ('action' in data) {

                            var _device = _indexes[data.data.deviceid];
                            console.log("device:", _device);
                            if (!_device & data.action !== 'create')
                                return;

                            if (data.action === 'sysmsg') {
                                if ('online' in data.params) {
                                    _device.online = data.params.online;
                                }

                                // manually trigger AngularJS digest
                                // so modified device property will be visible on UI
                                $rootScope.$apply();
                                return;
                            }

                            //update device status
                            if (data.action === 'update') {
                                _device.params = _device.params || {};
                                angular.extend(_device.params, data.data.params);
                                // manually trigger AngularJS digest
                                // so modified device property will be visible on UI
                                $rootScope.$apply();
                                return;
                            }

                            //create new device
                            if (data.action === 'create') {
                                if (_indexes[data.data.deviceid] === data.data)
                                    return;
                                _devices.push(data.data);
                                _indexes[data.data.deviceid] = data.data;
                                // manually trigger AngularJS digest
                                // so modified device property will be visible on UI
                                $rootScope.$apply();
                                return;
                            }

                            // delete device
                            if (data.action === 'delete')
                            {
                                var _device = _indexes[data.data.deviceid];
                                _devices.splice(_devices.indexOf(_device), 1);
                                delete _indexes[data.data.deviceid];
                                // manually trigger AngularJS digest
                                // so modified device property will be visible on UI
                                $rootScope.$apply();
                                return;
                            }

                            //update device information
                            if (data.action === 'updateinfo')
                            {

                            }

                        }
                        // response
                        else if ('error' in data) {
                            // dummy query response

                            if (!('sequence' in data))
                                return;

                            var _callback = _pending[data.sequence];
                            if (!_callback)
                                return;

                            if (data.error) {
                                _callback.error();
                            } else {
                                _callback.success(data);
                            }
                        }
                    });

                    // send dummy `query` requests
                    // so IoTgo server knows devices are on this connection.


                    WS.send({
                        content_type: 1,
                        userId: $cookies.get("email"),
                        apikey: $cookies.get("apikey")
                    });

                };

                return {
                    init: _init,
                    history: _history,
                    query: _query,
                    add: _add,
                    get: _get,
                    save: _save,
                    update: _update,
                    remove: _remove,
                    send: _send,
                    getValue: _getValue
                };
            }
        ]);