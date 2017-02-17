angular.module('zcloud').factory('WS', ['Settings', function (Settings) {
        var ws;
        var callbacks = [];
        var data_resp;        
        var wsServerUrl = Settings.websocketServer + '/api/ws';
        var connect = function (send) {
            ws = new WebSocket(wsServerUrl);
            ws.addEventListener('message', function (message) {
                try {
                    var data = JSON.parse(message.data);

                    callbacks.forEach(function (callback) {
                        callback(data);
                    });
                } catch (err) {
                    // Do nothing
                }
            });
            ws.addEventListener('error', function () {
                console.log('WebSocket Error');
            });

            ws.addEventListener('close', function () {
                console.log('WebSocket closed!');
            });

            ws.onmessage = function (event) {
                data_resp = event.data;
            };
            if (typeof send === 'function') {
                ws.addEventListener('open', send);
            }
        };

        connect();

        return {
            send: function (req) {
                if (typeof req !== 'object' || req === null) {
                    return;
                }

                req.userAgent = 'web';
                req = angular.toJson(req);

                if (ws && ws.readyState === 1) {
                    ws.send(req);
                    return;
                }

                connect(function () {
                    ws.send(req);
                });
            },
            addListener: function (callback) {
                callbacks.push(callback);
            },
            removeListener: function (callback) {
                var _index = callbacks.indexOf(callback);
                if (_index === -1)
                    return;
                callbacks.splice(_index, 1);
            }
        };
    }]);
