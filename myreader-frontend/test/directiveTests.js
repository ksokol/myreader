describe("test/directiveTests.js", function() {

    describe("loadingIndicator", function() {
        var $compile,
            $rootScope;

        beforeEach(module('common.directives'));
        beforeEach(inject(function(_$compile_, _$rootScope_){
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        }));

        it('should render inner html', function () {
            var element = $compile("<my-loading-indicator></my-loading-indicator>")($rootScope);
            expect(element.html()).toContain("md-progress-linear");
        });

        it('should show and hide inner html on event', function () {
            var element = $compile("<my-loading-indicator></my-loading-indicator>")($rootScope);
            var scope = element.scope();

            scope.$broadcast('loading-complete');
            expect(scope.isDisabled).toEqual(true);

            scope.$broadcast('loading-started');
            expect(scope.isDisabled).toEqual(false);

            scope.$broadcast('loading-complete');
            expect(scope.isDisabled).toEqual(true);
        });
    });
});
