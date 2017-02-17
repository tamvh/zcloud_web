angular.module('zcloud')

        .factory('Settings', ['$location', function ($location) {
                var host = $location.host() + ':' + $location.port();
                host += '/call'; // khi thay đổi host thì comment dòng code này.    
                return {
                    httpServer: 'http://' + host,
                    websocketServer: 'ws://' + $location.host() + ":9981" 
                };
            }])
        .config(function ($mdThemingProvider) {
            var customBlueMap = $mdThemingProvider.extendPalette('light-blue', {
                'contrastDefaultColor': 'light',
                'contrastDarkColors': ['50'],
                '50': 'ffffff'
            });
            $mdThemingProvider.definePalette('customBlue', customBlueMap);
            $mdThemingProvider.theme('default')
                    .primaryPalette('customBlue', {
                        'default': '500',
                        'hue-1': '50'
                    })
                    .accentPalette('pink');
            $mdThemingProvider.theme('input', 'default')
                    .primaryPalette('grey');
        });
