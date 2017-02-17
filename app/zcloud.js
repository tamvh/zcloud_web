angular.module('zcloud', ['ngMaterial', 'ngMdIcons', 'ngRoute', 'ngResource', 'ngCookies', 'gRecaptcha', 'ngRoute'])
        .run(['$location', function ($location) {
            }]).config(['$routeProvider', '$locationProvider', '$httpProvider',
    function ($routeProvider, $locationProvider, $httpProvider) {
        $routeProvider.when('/', {
            templateUrl: '/views/dashboard.html',
            controller: 'DashboardCtrl'
        }).when('/dashboard', {
            templateUrl: '/views/dashboard.html',
            controller: 'DashboardCtrl'
        }).when('/login', {
            templateUrl: '/views/login.html',
            controller: 'LoginCtrl'
        }).when('/signup', {
            templateUrl: '/views/signup.html',
            controller: 'SignupCtrl'
        }).when('/profile', {
            templateUrl: '/views/profile.html',
            controller: 'ProfileCtrl'
        }).when('/device', {
            templateUrl: '/views/devices.html',
            controller: 'DevicesCtrl'
        }).when('/about', {
            templateUrl: '/views/index.html'
        }).when('/search', {
            templateUrl: '/views/search.html'
        }).when('/history', {
            templateUrl: '/views/history.html',
            controller: 'HistoryCtrl'
        }).otherwise({
            redirectTo: '/'
        });

        $httpProvider.interceptors.push('authInterceptor');
    }
]);
