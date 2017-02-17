angular.module('zcloud').
  filter('typeToImage', function () {
    var images = {
      0: 'custom.png',
      1: 'switch.png',
      2: 'light.png',
      3: 'sensor-temperature.png',
      4: 'sensor-humidity.png',
      5: 'lightning.png',
      6: 'human.png',
      7: 'snake.png',
      '0_1': 'switch-off.png',
      '1_1': 'switch-on.png',
      '0_2': 'light-off.png',
      '1_2': 'light-on.png',
      '0_6': 'unhappy.png',
      '1_6': 'happy.png'
      };

    return function (value) {
     return images[value] || images[0];
    };
  });