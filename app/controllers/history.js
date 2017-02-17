angular.module('zcloud').
        controller('HistoryCtrl', ['$scope', '$window', '$location', 'Devices',
            function ($scope, $window, $location, Devices) {
                var _devices;
                $scope.data = {
                    devices: []
                };
                $scope.totalItems = 0;
                $scope.itemPerPage = 15;
                $scope.currentPage = 1;
                $scope.init = function () {
                    $scope.startPage = 0;
                    $scope.endPage = 0;
                    Devices.query(function (devices) {
                        _devices = devices;
                        $scope.data.devices = _devices;     
                        if($scope.data.devices.length > 0) {
                            $scope.deviceId = $scope.data.devices[0].deviceid; 
                            $scope.selectDevice();
                        }                        
                    }, function () {
                        $window.alert('Retrieve device list failed!');
                    });
                };
                $scope.init();
                $scope.selectDevice = function () {
                    $scope.totalItems = 0;
                    $scope.itemPerPage = 15;
                    $scope.currentPage = 1;
                    $scope.count = -1; //get all
                    Devices.history($scope.count, $scope.deviceId, function (history) {
                        $scope.logs = history;
                        $scope.totalItems = $scope.logs.length;
                        $scope.totalPages = parseInt($scope.totalItems / $scope.itemPerPage) + 1;
                        if ($scope.totalItems % $scope.itemPerPage === 0) {
                            $scope.totalPages = parseInt($scope.totalItems / $scope.itemPerPage);
                        }
                        $scope.pageChanged();
                    });
                };

                $scope.nextPage = function () {
                    if ($scope.currentPage < $scope.totalPages) {
                        $scope.currentPage = $scope.currentPage + 1;
                    }
                    $scope.pageChanged();
                };

                $scope.prePage = function () {
                    if ($scope.currentPage > 1) {
                        $scope.currentPage = $scope.currentPage - 1;
                    }
                    $scope.pageChanged();
                };

                $scope.pageChanged = function () {
                    $scope.logCurrentPage = [];
                    var j = 0;
                    var jsonAllLog = JSON.parse('{"data":[]}');
                    var start = ($scope.currentPage - 1) * $scope.itemPerPage;
                    var end = start + 15;
                    if (end > $scope.totalItems) {
                        end = $scope.totalItems;
                    }
                    if($scope.totalItems === 0)
                        end = 0;
                    $scope.startPage = start + 1;
                    $scope.endPage = end;
                    for (var i = start; i < end; i++) {
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
                $scope.reload = function() {
                    $scope.selectDevice();
                };
            }
        ]);