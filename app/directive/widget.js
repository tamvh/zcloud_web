'use strict';

angular.module('zcloud')
        .controller('PanelWidgetController',
                ['$scope', '$window', '$location', '$interval', '$cookies', '$mdDialog', '$mdMedia', 'User', 'Devices', 'Dashboard', 'WS', 'Widgets',
                    function ($scope, $window, $location, $interval, $cookies, $mdDialog, $mdMedia, User, Devices, Dashboard, WS, Widgets) {
                        $scope.showHistory = function (widget, ev) {
                            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
                            $mdDialog.show({
                                controller: 'HistoryDialogCtrl',
                                templateUrl: '/views/dialog.history.tmpl.html',
                                parent: angular.element(document.body),
                                targetEvent: ev,
                                locals: {
                                    widget: widget
                                },
                                clickOutsideToClose: true,
                                fullscreen: useFullScreen
                            })
                                    .then(function (answer) {
                                        if (answer === "refresh") {
                                        }
                                    }, function () {
                                        $scope.status = 'You cancelled the dialog.';
                                    });
                            $scope.$watch(function () {
                                return $mdMedia('xs') || $mdMedia('sm');
                            }, function (wantsFullScreen) {
                                $scope.customFullscreen = (wantsFullScreen === true);
                            });
                        };
                    
                        $scope.showWidgetSettings = function (widget, ev) {
                            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
                            $mdDialog.show({
                                controller: 'UpdateWidgetDialogCtrl',
                                templateUrl: '/views/dialog.updatewidget.tmpl.html',
                                parent: angular.element(document.body),
                                targetEvent: ev,
                                locals: {
                                    widget: widget
                                },
                                clickOutsideToClose: true,
                                fullscreen: useFullScreen
                            })
                                    .then(function (answer) {
                                        if (answer === "refresh") {
                                        }
                                    }, function () {
                                        $scope.status = 'You cancelled the dialog.';
                                    });
                            $scope.$watch(function () {
                                return $mdMedia('xs') || $mdMedia('sm');
                            }, function (wantsFullScreen) {
                                $scope.customFullscreen = (wantsFullScreen === true);
                            });
                        };

                        $scope.deleteWidget = function (widget) {
                            
                            var confirm = $mdDialog.confirm()
                                    .title('Delete confirmation')
                                    .textContent('You really want to delete this widget?')
                                    .ok('Delete')
                                    .cancel('Cancel');
                            $mdDialog
                                    .show(confirm)
                                    .then(function (answer) {
                                        confirm = undefined;
                                        console.log('You confirm delete the dialog.');

                                        Widgets.remove(
                                                widget.id
                                                , function () {
                                                    $mdDialog.hide("refresh");
                                                }, function () {
                                            $window.alert('Delete widget failed! Please try again later.');
                                        });
                                    }, function () {
                                        confirm = undefined;
                                        console.log('You cancelled the dialog.');
                                    });
                        };
                    }])
        .directive('panelWidget', function () {
            return {
                restrict: 'E',
                replace: true,
                transclude: true,
                scope: {title: '@', template: '@', options: '@', widget: '='},
                templateUrl: '/views/widget.chrome.tmpl.html',
                controller: 'PanelWidgetController',
                compile: function (element, attrs, linker) {
                    return function (scope, element) {
                        linker(scope, function (clone) {
                            element.append(clone);
                        });
                    };
                }
            };
        });

