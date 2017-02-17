angular.module('zcloud')
.directive('zcMainMenu', function() {
    return {
        restrict: 'E',
        replace: true,        // replace original markup with template
        transclude: false,    // do not copy original HTML content        
        templateUrl: '/views/main-menu.html'
    };
});
