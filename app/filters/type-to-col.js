angular.module('zcloud').
  filter('typeToCol', function () {
    var cols = {
      1: 'col-sm-4',
      2: 'col-sm-8',
      3: 'col-sm-12'
      };

    return function (value) {
     return cols[value] || cols[0];
    };
  });