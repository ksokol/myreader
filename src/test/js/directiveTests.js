describe("loadingIndicator directive", function() {
    var $compile,
        $rootScope;

    beforeEach(module('common.directives'));
    beforeEach(inject(function(_$compile_, _$rootScope_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    it('should render inner html', function () {
        var element = $compile("<div loading-indicator><p>notification</p></div>")($rootScope);
        expect(element.html()).toContain("<p>notification</p>");
    });

    it('should show and hide inner html on event', function () {
        var element = $compile("<div loading-indicator><p>notification</p></div>")($rootScope);
        var scope = element.scope();

        scope.$broadcast('loading-complete');
        expect(element.hasClass('hide')).toBeTruthy();

        scope.$broadcast('loading-started');
        expect(element.hasClass('hide')).toBeFalsy();

        scope.$broadcast('loading-complete');
        expect(element.hasClass('hide')).toBeTruthy();
    });
});
