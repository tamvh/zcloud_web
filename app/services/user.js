angular.module('zcloud')
        .factory('User', ['$http', '$cookies', '$window', 'Settings', function ($http, $cookies, $window, Settings) {
                return {
                    register: function (email, password, response, callback) {
                        $http.post(Settings.httpServer + '/api/user/register', {email: email, password: password})
                                .success(function (data) {
                                    if (data.error) {
                                        callback(data.error);
                                        return;
                                    }

                                    $cookies.put('token', data.jwt);
                                    $cookies.put('session', JSON.stringify(data));
                                    callback(undefined, data.user);
                                }).error(function () {
                            callback('Register user failed!');
                        });
                    },
                    login: function (email, password, callback) {
                        $http.post(Settings.httpServer + '/api/user/login', {email: email, password: password})
                                .success(function (data) {
                                    if (data.error) {
                                        callback(data.error);
                                        return;
                                    }

                                    $cookies.put('token', data.jwt);
                                    $cookies.put('session', JSON.stringify(data));
                                    $cookies.put('apikey', data.user.apikey);
                                    $cookies.put('email', data.user.email);
                                    callback(undefined, data.user);
                                })
                                .error(function () {
                                    callback('Log in failed!');
                                });
                    },
                    logout: function () {
                        $cookies.remove('token');
                        $cookies.remove('session');                        
                    },
                    isLoggedIn: function () {
                        return $cookies.get('session') ? true : false;
                    },
                    setPassword: function (oldPassword, newPassword, callback) {
                        $http.post(Settings.httpServer + '/api/user/password',
                                {oldPassword: oldPassword, newPassword: newPassword}).success(function (data) {
                            if (data.error) {
                                callback(data.error);
                                return;
                            }

                            callback(undefined);
                        }).error(function () {
                            callback('Change password failed!');
                        });
                    },
                    getUser: function () {
                        var ss = $cookies.get('session');
                        if (ss === undefined) {
                            return {};
                        }
                        var json = JSON.parse(ss);
                        return json.user;
                    },
                    getToken: function () {
                        var token = $cookies.get('token');
                        return token;
                    },
                    isActive: function () {
                        var token = $cookies.get('token');
                        if (!token) {
                            return false;
                        }
                        var info = token.substring(token.indexOf('.') + 1, token.lastIndexOf('.'));
                        var decodedData = $window.atob(info);
                        var json = JSON.parse(decodedData);
                        return !!(json.isActivated);
                    },
                    isExpire: function () {
                        var token = $cookies.get('token');
                        if (!token) {
                            return false;
                        }
                        var info = token.substring(token.indexOf('.') + 1, token.lastIndexOf('.'));
                        var decodedData = $window.atob(info);
                        var json = JSON.parse(decodedData);
                        if (!json.isActivated) {
                            return Date.now() > new Date(json.validExpire).getTime();
                        }
                        return false;
                    },
                    activeAccount: function (callback) {
                        $http.get('/api/user/activeAccount').success(function (data) {
                            callback(data);
                        }).error(function () {
                            callback('Active Account failed,Please retry!');
                        });
                    }
                };
            }]);