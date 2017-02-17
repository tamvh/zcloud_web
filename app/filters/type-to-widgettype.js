angular.module('zcloud').
  filter('typeToWidgetType', function () {
    var types = {        
      0: '00 (Custom)',
      1: '01 (Power switch)',
      2: '02 (Simple lamp)',
      3: '03 (Temperature sensor)',
      4: '04 (Humidity sensor)',
      5: '05 (Light sensor)',
      6: '06 (Human presence)',
      7: '07 (Smart snake)'
      };

    return function (value) {
     return types[value] || types[0];
    };
  });