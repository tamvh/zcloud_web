angular.module('zcloud')
        .factory('Search', ['$cookies', function ($cookies) {
                return {
                    setKey: function (key) {
                        $cookies.put('key_search', key);
                    },
                    getKey: function () {
                        return $cookies.get('key_search');
                    }
                };
            }]);