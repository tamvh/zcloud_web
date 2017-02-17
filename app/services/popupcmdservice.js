'use strict';
/**
 * @ngdoc service
 * @name zcloud.PupupCMDService
 * @description
 * # PupupCMDService
 * Factory in the zcloud.
 */
angular.module('zcloud')
        .factory('PupupCMDService', ['$modal',
            function ($modal) {
                return {
                    displayPopup: function (msg) {
                        $modal.open({
                            templateUrl: 'views/popupcmd.html',
                            controller: 'PopupcmdCtrl',
                            resolve: {
                                msg: function () {
                                    return msg;
                                }
                            }
                        });
                    }
                };
            }]);
