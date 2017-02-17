angular.module('zcloud')
        .controller('HistoryDialogCtrl', ['$scope', '$mdDialog', '$window', 'Devices', 'Widgets', 'widget',
            function ($scope, $mdDialog, $window, Devices, Widgets, widget) {
                $scope.widget = widget;
                $scope.data = {
                    devices: []
                };

                $scope.widget.deviceId = '';
                $scope.totalItems = 0;
                $scope.itemPerPage = 5;
                $scope.currentPage = 1;
                $scope.init = function () {
                    $scope.widgetName = $scope.widget.name;
                    var total = 19;
                    Devices.history(total, $scope.widget.device_id, function (history) {
                        $scope.logs = history;
                        $scope.totalItems = $scope.logs.length;
                        $scope.totalPages = parseInt($scope.totalItems / $scope.itemPerPage) + 1;
                        if($scope.totalItems % $scope.itemPerPage === 0) {
                            $scope.totalPages = parseInt($scope.totalItems / $scope.itemPerPage);
                        }
                        
                        $scope.pageChanged();
                    });
                };

                $scope.items = function () {
                    var res = [];
                    var n = $scope.totalPages;
                    for (var i = 1; i <= n; i++) {
                        res.push(i);
                    }
                    return res;
                };

                $scope.getFistPage = function () {
                    $scope.currentPage = 1;
                    $scope.pageChanged();
                };

                $scope.getLastPage = function () {
                    $scope.currentPage = $scope.totalPages;
                    $scope.pageChanged();
                };

                $scope.getCurrentPage = function (page) {
                    $scope.currentPage = page;
                    $scope.pageChanged();
                };

                $scope.pageChanged = function () {
                    var j = 0;
                    var jsonAllLog = JSON.parse('{"data":[]}');
//                    var start = $scope.totalItems - 1 - ($scope.currentPage - 1) * $scope.itemPerPage;
                    var start = 0;
                    var end = start + 4;
                    if (end < 0) {
                        end = 0;
                    }                    
                    for (var i = start; i <= end; i++) {
                        var d = new Date($scope.logs[i].localTime * 1000);  
                        $scope.logs[i].time = d.toLocaleDateString() + ' ' + d.toLocaleTimeString();                           
                        $scope.logs[i].seq = j + 1;
                        $scope.logs[i].no = ($scope.currentPage - 1) * $scope.itemPerPage + j + 1;      
                        $scope.logs[i].source = 'Unknown';
                        j++;
                        jsonAllLog['data'].push($scope.logs[i]);
                    }
                    $scope.logCurrentPage = jsonAllLog['data'];
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
            }
        ]);
