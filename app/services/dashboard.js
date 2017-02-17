(function () {
angular.module('zcloud')
.factory('Dashboard', ['$resource', '$rootScope', 'Settings', 'WS', 'Widgets', '$cookies', '$interval',
		DashboardFactory]);

function DashboardFactory($resource, $rootScope, Settings, WS, Widgets, $cookies, $interval) {

  var _widgets = [], _indexes = {};
  var _listenWebSocketRegister = false;

  // var _query = function (successCallback, errorCallback) {

  //     if (_widgets) {
  //         successCallback(_widgets);
  //         return;
  //     }

  //     Resource.query(function (widgets) {
  //         _widgets = widgets;
  //         angular.forEach(_widgets, function (_device) {
  //             _indexes[_device.deviceid] = _device;
  //         });

  //         _listenWebSocket();
  //         successCallback(_widgets);
  //     }, errorCallback);
  // };
  
  // var _getValue = function (widgetId, successCallback, errorCallback) {
  //     var _device = _indexes[widgetId];

  //     _listenWebSocket();
  //     if (_widgets) {
  //         successCallback(_device.params);
  //         return;
  //     }

  // };
  
  // var _get = function (widgetId, successCallback, errorCallback) {                   
  //     var _device = _indexes[widgetId];

  //     if (_device) {
  //         successCallback(_device);
  //         return;
  //     }

  //     Resource.get({id: widgetId}, function (device) {
  //       _device = device;
  //       _widgets.push(device);
  //       _indexes[widgetId] = _device;
  //       successCallback(_device);
  //     }, function() {
  //       errorCallback();
  //     });
  // };

  // var _remove = function (widgetId, successCallback, errorCallback) {
  //     var _device = _indexes[widgetId];
  //     if (_device) {
  //         _device.$remove(function (device) {
  //             if (device.error) {
  //                 errorCallback();
  //                 return;
  //             }

  //             _widgets.splice(_widgets.indexOf(_device), 1);
  //             delete _indexes[widgetId];
  //             successCallback(_device);
  //         }, errorCallback);

  //         return;
  //     }

  //     errorCallback();
  // };

  // var _add = function (deviceData, successCallback, errorCallback) {
  //     Resource.add(deviceData, function (device) {
  //         if (device.error) {
  //             errorCallback();
  //             return;
  //         }

  //         _widgets.push(device);
  //         _indexes[device.deviceid] = device;

  //         successCallback(device);
  //     }, errorCallback)
  // };

  // var _save = function (deviceData, successCallback, errorCallback) {
  //     Resource.save(deviceData, function (device) {
  //         if (device.error) {
  //             errorCallback();
  //             return;
  //         }

  //         _widgets.push(device);
  //         _indexes[device.deviceid] = device;

  //         successCallback(device);
  //     }, errorCallback);
  // };

  // var _pending = {};

  // var _send = function (data, successCallback, errorCallback) {
  //     if (!angular.isObject(data)) {
  //         return;
  //     }

  //     data.sequence = '' + Date.now();
  //     _pending[data.sequence] = {
  //         success: successCallback,
  //         error: errorCallback
  //     };

  //     WS.send(data);
  // };

  var _init = function() {      
    _listenWebSocket();    
  };

  var _listenWebSocket = function () {
    if (_listenWebSocketRegister) {
      return;
    }
    _listenWebSocketRegister = true;
    WS.addListener(function (data) {
      // request
      console.log("DB: receive data from WS:", data);
      if ('action' in data) {

        console.log("DB: device:", data.data);
        // if (!_device)
        //     return;


        //update device status
        if (data.action === 'update') {
            // _device.params = _device.params || {};
            // angular.extend(_device.params, data.data.params);
            // manually trigger AngularJS digest
            // so modified device property will be visible on UI
            $rootScope.$broadcast('DEVICE_DATA_UPDATE_' + data.data.deviceid, data.data);
            return;
        }
      }
    });

    // send dummy `query` requests
    // so IoTgo server knows widgets are on this connection.


    WS.send({
        content_type: 1,
        userId: $cookies.get("email"),
        apikey: $cookies.get("apikey")
    });
  };

  return {
      init: _init
      // query: _query,
      // add: _add,
      // get: _get,
      // save: _save,
      // remove: _remove,
      // send: _send,
      // getValue: _getValue
  };
}

})();