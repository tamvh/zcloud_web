angular.module('zcloud').
  filter('typeToHtml', function () {
    var types = {
      0: 'custom.html',
      1: 'switch.html',
      2: 'simplelamp.html',
      3: 'sensor-temperature.html',
      4: 'sensor-humidity.html',
      5: 'sensor-light.html'
    };

    return function (value, path) {
      return path + (types[value] || types[0]);
    };
  });