(function () {
  angular
          .module('zcloud')
          .controller('WidgetLiveChartController', ['$scope', 'Devices',
            WidgetLiveChartController
          ]);

  function WidgetLiveChartController($scope, Devices) { 
    var vm = this;
//    vm.widget.chartid = vm.widget.id;
    var ctx;
    var myNewChart;
    var _data = [0 ,0, 0, 0, 0];    
    var dataLine = {
      labels: ["", "", "", "", ""],
      datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: _data
        }
      ]
    };
    
    var updateData = function(oldData){
//        var labels = oldData["labels"];
//        labels.shift();
      var dataSetA = oldData["datasets"][0]["data"];
//        var d = new Date(Date.now() * 1000);
//        labels.push(d.toLocaleTimeString());
      var newDataA = vm.deviceValue;
      dataSetA.push(newDataA);
      dataSetA.shift();
    };
    
    var optionsAnimation = {
      //Boolean - If we want to override with a hard coded scale
      scaleOverride : true,
      //** Required if scaleOverride is true **
      //Number - The number of steps in a hard coded scale
      scaleSteps : 10,
      //Number - The value jump in the hard coded scale
      scaleStepWidth : 10,
      //Number - The scale starting value
      scaleStartValue : 0
    };

    // Not sure why the scaleOverride isn't working...
    var optionsNoAnimation = {
      animation : false,
      //Boolean - If we want to override with a hard coded scale
      scaleOverride : true,
      //** Required if scaleOverride is true **
      //Number - The number of steps in a hard coded scale
      scaleSteps : 20,
      //Number - The value jump in the hard coded scale
      scaleStepWidth : 10,
      //Number - The scale starting value
      scaleStartValue : 0
    };
    
    var optionsNoAnimation = {animation : false};
    
    vm.widget = $scope.$parent.widget;
    vm.device = {};
    vm.deviceValue = undefined;
    

    vm.getValue = function () {
      if (vm.device.params === undefined) {
        return undefined;
      }
      for (var i = 0; i < vm.device.params.length; i++) {
        var pVar = vm.device.params[i];
        if (pVar.varId === vm.widget.variable_id) {
          return pVar.value;
        }
      }
      return undefined;
    };

    console.log("Register scope: ", 'DEVICE_DATA_UPDATE_' + vm.widget.device_id);
    $scope.$on('DEVICE_DATA_UPDATE_' + vm.widget.device_id, function (event, data) {
      vm.device.value = vm.device.value || {};
      angular.extend(vm.device.value, data.value);
      vm.deviceValue = data.value;     
      updateData(dataLine);        
      myNewChart.Line(dataLine, optionsNoAnimation);
      console.log("Device value updated:", vm.deviceValue);
      
    });

    Devices.get(vm.widget.device_id, function (device) {  
      console.log("Device:", device);
      vm.device = device;
      vm.deviceValue = vm.device.value;
      vm.id = vm.widget.id;
      
      //init chart area
      ctx = document.getElementById('xxx').getContext("2d");
      myNewChart = new Chart(ctx);
      updateData(dataLine);  
      myNewChart.Line(dataLine, optionsNoAnimation);      
      console.log("Device value:", vm.deviceValue);
    });    
  }
})();
