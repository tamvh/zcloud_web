angular.module('zcloud').
  filter('typeToTemplateWidget', function () {
    var types = {
      0: 'widget.custom.html',
      1: 'widget.onoff.tmpl.html',
      2: 'widget.simplelamp.tmpl.html',
      3: 'widget.temperature.tmpl.html',
      4: 'widget.humidity.tmpl.html',
      5: 'widget.light.tmpl.html',
      6: 'widget.humanpresence.tmpl.html',
      7: 'widget.smartsnake.tmpl.html'
    };

    return function (value) {
      return types[value] || types[0];
    };
  });