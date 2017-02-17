angular.module('zcloud')
        .factory('Widgets', ['$resource', 'Settings',
          function ($resource, Settings) {
            var Resource = $resource(Settings.httpServer + '/api/web/widget/:id', {id: '@id'}, {
              removeall: {method: 'DELETE', url: Settings.httpServer + '/api/web/widget/all'},
              add: {method: 'POST'}
            });

            var _widgets = {};
            var _indexes = {};

            var _query = function (successCallback, errorCallback) {

//              if (_widgets) {
//                successCallback(_widgets);
//                return;
//              }

              Resource.query(function (widgets) {
                _widgets = widgets;
                angular.forEach(_widgets, function (_widget) {
                  _indexes[_widget.id] = _widget;
                });

                // _listenWebSocket();
                successCallback(_widgets);
              }, errorCallback);
            };

            var _getValue = function (widgetId, successCallback, errorCallback) {
              var _item = _indexes[widgetId];

              // _listenWebSocket();
              if (_widgets) {
                successCallback(_item);
                return;
              }
            };

            var _get = function (widgetId, successCallback, errorCallback) {
              var _item = Resource.get({id: widgetId}, function () {
              });

              if (_item) {
                successCallback(_item);
                return;
              }

              errorCallback();
            };

            var _remove = function (widgetId, successCallback, errorCallback) {
                
              var _item = _indexes[widgetId];
              console.log("remove widget: ", _item);
              if (_item) {
                _item.$remove(function (widget) {
                  if (widget.error) {
                    errorCallback();
                    return;
                  }

                  _widgets.splice(_widgets.indexOf(_item), 1);
                  delete _indexes[widgetId];
                  successCallback(_item);
                }, errorCallback);

                return;
              }

              errorCallback();
            };

            var _add = function (widgetData, successCallback, errorCallback) {
              widgetData["action"] = "widgets.add";
              console.log("add widget: ", widgetData);
              Resource.add(widgetData, function (widget) {
                if (widget.error) {
                  errorCallback();
                  return;
                }

                _widgets.push(widget.data);
                _indexes[widget.data.id] = widget.data;

                successCallback(widget.data);
              }, errorCallback);
            };

            var _save = function (widgetData, successCallback, errorCallback) {
              widgetData["action"] = "widgets.update";
              console.log("save widget: ", widgetData);
              Resource.save(widgetData, function (widget) {
                if (widget.error) {
                  errorCallback();
                  return;
                }

                successCallback(widget);
              }, errorCallback);
            };

            return {
              query: _query,
              add: _add,
              get: _get,
              save: _save,
              remove: _remove,
              getValue: _getValue
            };
          }
        ]);
