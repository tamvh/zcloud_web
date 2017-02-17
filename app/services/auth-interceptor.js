angular.module('zcloud').
  factory('authInterceptor', [ '$window', '$q', '$cookies', function ($window, $q, $cookies) {
      return {
        request: function (config) {
          config.headers = config.headers || {};
          if ($cookies.get('token')) {
            config.headers.Authorization = 'Bearer ' + $cookies.get('token');
          }
          return config;
        },
        response: function (response) {
          if (response.status === 401) {
            $window.alert('Restricted area, please log in first!');
            return;
          }

          return response;
        }
      }
}]);
