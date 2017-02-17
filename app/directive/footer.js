angular.module('zcloud')
.directive('zcFooter', function() {
    return {
        restrict: 'E',
        replace: true,        // replace original markup with template
        transclude: false,    // do not copy original HTML content        
        templateUrl: '/views/footer.html'
    };
});
