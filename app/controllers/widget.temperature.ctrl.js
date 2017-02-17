/* global Highcharts */

(function () {
    angular
            .module('zcloud')
            .controller('WidgetTempController', ['$scope', 'Devices',
                WidgetTempController
            ]);

    function WidgetTempController($scope, Devices) {
        var vm = this;
        var chart;
        var _data = new Array(20);
        var _labels = new Array(20);

        vm.widget = $scope.$parent.widget;
        vm.device = {};
        vm.deviceValue = undefined;
        vm.deviceBattery = undefined;

        console.log("Register scope: ", 'DEVICE_DATA_UPDATE_' + vm.widget.device_id);
        $scope.$on('DEVICE_DATA_UPDATE_' + vm.widget.device_id, function (event, data) {
            vm.device.value = vm.device.value || {};
            angular.extend(vm.device.value, data.value);
            vm.device.value = data.value;
            vm.deviceValue = data.value;
            vm.deviceBattery = data.battery;
            document.getElementById(vm.valueid).innerHTML = 'Temp: ' + vm.deviceValue.toString() + ' &#8451;';
            document.getElementById(vm.batteryid).innerHTML = 'Battery: ' + vm.deviceBattery.toString() + ' %';
            if (vm.device.localTime === "") {
                document.getElementById(vm.localtimeid).innerHTML = "undefined";
                vm.localTime = "undefined";
            } else {
                var timestamp = new Date(data.localTime * 1000);
                vm.localTime = timestamp.toLocaleTimeString() + " " + timestamp.toLocaleDateString();
                document.getElementById(vm.localtimeid).innerHTML = timestamp.toLocaleTimeString() + " " + timestamp.toLocaleDateString();
            }
            vm.typeImg = vm.widget.type;
            var series = chart.series[0];
            var x = (new Date(data.localTime * 1000)).getTime();
            var y = parseFloat(data.value);
            series.addPoint([x, y], true, true);
            console.log("Device value updated:", vm.deviceValue);
        });

        Devices.get(vm.widget.device_id, function (device) {
            console.log("Device:", device);
            vm.device = device;
            vm.deviceValue = vm.device.value;
            vm.deviceBattery = vm.device.battery;
            vm.typeImg = vm.widget.type;
            vm.valueid = "value_" + vm.widget.device_id.toString();
            vm.batteryid = "battery_" + vm.widget.device_id.toString();
            vm.localtimeid = "localtime_" + vm.widget.device_id.toString();
            vm.chartid = "chart_" + vm.widget.device_id.toString();
            var limit = 20;
            Devices.history(limit - 1, vm.widget.device_id, function (history) {
                console.log("History:", history);
                for (var i = 0; i < history.length; i++) {
                    if (i >= limit)
                        break;
                    _data[limit - i - 1] = parseFloat(history[i].value);
                    var timestamp = (new Date(history[i].localTime * 1000)).getTime();
                    _labels[limit - i - 1] = timestamp;
                }

                Highcharts.setOptions({
                    global: {
                        useUTC: false
                    }
                });
                //init chart area
                chart = new Highcharts.chart(vm.chartid, {
                    chart: {
                        zoomType: 'x'
                    },
                    title: {
                        text: ''
                    },
                    xAxis: {
                        labels: {
                            enabled: false
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'Value (Temp)'
                        }
                    },
                    tooltip: {
                        formatter: function () {
                            var x = this.x;
                            return '<b>' + this.series.name + '</b><br/>' +
                                    '+ Time: ' + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', x) + '<br/>' +
                                    '+ Value: ' + Highcharts.numberFormat(this.y, 2);
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    credits: {
                        enabled: false
                    },
                    plotOptions: {
                        area: {
                            fillColor: {
                                linearGradient: {
                                    x1: 0,
                                    y1: 0,
                                    x2: 0,
                                    y2: 1
                                },
                                stops: [
                                    [0, Highcharts.getOptions().colors[0]],
                                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                                ]
                            },
                            marker: {
                                radius: 2
                            },
                            lineWidth: 1,
                            states: {
                                hover: {
                                    lineWidth: 1
                                }
                            },
                            threshold: null
                        }
                    },

                    series: [{
                            type: 'area',
                            name: vm.widget.name,
                            data: (function () {
                                var data = [];
                                for (var i = 0; i < limit; i++) {
                                    console.log(_labels[i]);
                                    data.push({
                                        x: _labels[i],
                                        y: _data[i]
                                    });
                                }
                                return data;
                            }())
                        }]
                });

                document.getElementById(vm.valueid).innerHTML = 'Temp: ' + vm.deviceValue.toString() + ' &#8451;';
                document.getElementById(vm.batteryid).innerHTML = 'Battery: ' + vm.deviceBattery.toString() + ' %';
                if (vm.device.localTime === "") {
                    document.getElementById(vm.localtimeid).innerHTML = "undefined";
                } else {
                    var timestamp = new Date(vm.device.localTime * 1000);
                    document.getElementById(vm.localtimeid).innerHTML = timestamp.toLocaleTimeString() + " " + timestamp.toLocaleDateString();
                }
            });
            console.log("Device value:", vm.deviceValue);
        });
    }
})();