angular.module('zcloud').
  filter('typeToWidgetSize', function () {
    var sizes = {
      1: '30',
      2: '60',
      3: '100'
      };

    return function (value) {
     return sizes[value] || sizes[0];
    };
  });