describe("directive", function() {

    describe("loadingIndicator", function() {
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

    describe("myWrapEntryContent", function() {
        var $compile,
            window,
            mdMedia,
            rootScope;

        beforeEach(module('common.directives', function($provide) {
            window = {
                innerWidth: jasmine.createSpy()
            };

            mdMedia = jasmine.createSpy();

            $provide.provider(myMock.providerWithObj('$window', window));
            $provide.provider(myMock.providerWithObj('$mdMedia', mdMedia));
        }));

        beforeEach(inject(function(_$compile_, $rootScope){
            $compile = _$compile_;
            rootScope = $rootScope
        }));

        it('should set max-width to specific value on small screen', function() {
            mdMedia.and.returnValue(true);

            var element = $compile("<div my-wrap-entry-content>content</div>")(rootScope);
            window.innerWidth = 1280;

            rootScope.$digest();

            expect(element[0].style.cssText.trim()).toEqual('max-width: 914px;');
        });

        it('should set max-width to specific value on big screen', function() {
            mdMedia.and.returnValue(false);

            var element = $compile("<div my-wrap-entry-content>content</div>")(rootScope);
            window.innerWidth = 1280;

            rootScope.$digest();

            expect(element[0].style.cssText.trim()).toEqual('max-width: 1264px;');
        });
    });

    describe("myClickBroadcast", function() {
        var $compile,
            $rootScope;

        beforeEach(function() {
            module('common.directives');
        });

        beforeEach(inject(function(_$compile_, _$rootScope_){
            $compile = _$compile_;
            $rootScope = _$rootScope_;

            spyOn($rootScope, '$broadcast');
        }));

        it("shouldn't broadcast any event without a click", function () {
            $compile('<button my-click-broadcast="navigation-close"></button>')($rootScope);
            $rootScope.$digest();

            expect($rootScope.$broadcast).not.toHaveBeenCalled();
        });

        it("shouldn't broadcast any event without a click", function () {
            var element = $compile('<button my-click-broadcast=""></button>')($rootScope);
            element.triggerHandler('click');
            $rootScope.$digest();

            expect($rootScope.$broadcast).not.toHaveBeenCalled();
        });

        it('should broadcast "t1" event', function () {
            var element = $compile('<button my-click-broadcast="t1"></button>')($rootScope);
            element.triggerHandler('click');
            $rootScope.$digest();

            expect($rootScope.$broadcast).toHaveBeenCalledWith('t1');
        });

        it('should broadcast "t1" and "t2" event sequentially', function () {
            var element = $compile('<button my-click-broadcast="t1 t2"></button>')($rootScope);
            element.triggerHandler('click');
            $rootScope.$digest();

            expect($rootScope.$broadcast.calls.argsFor(0)).toEqual(['t1']);
            expect($rootScope.$broadcast.calls.argsFor(1)).toEqual(['t2']);
        });
    });

    describe("myShowAdmin", function() {
        var $compile,
            $rootScope,
            mockPermissionService;

        beforeEach(function() {
            module('common.directives');

            mockPermissionService = {
                isAdmin: jasmine.createSpy()
            };

            module(function($provide) {
                $provide.value('permissionService', mockPermissionService)
            });
        });

        beforeEach(inject(function(_$compile_, _$rootScope_){
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        }));

        it('should show inner html for admin', function () {
            var element = $compile("<div my-show-admin><p>show</p></div>")($rootScope);
            mockPermissionService.isAdmin.and.returnValue(true);
            $rootScope.$digest();

            expect(element.hasClass('hide')).toBeFalsy();
        });

        it('should hide inner html for non admin', function () {
            var element = $compile("<div my-show-admin><p>show</p></div>")($rootScope);
            mockPermissionService.isAdmin.and.returnValue(false);
            $rootScope.$digest();

            expect(element.hasClass('hide')).toBeTruthy();
        });
    });

    describe("myDisableLoading", function() {
        var $compile,
            $rootScope;

        beforeEach(module('common.directives'));

        beforeEach(inject(function(_$compile_, _$rootScope_){
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        }));

        it('should disable/enable element on specific event', function () {
            var element = $compile("<div my-disable-loading></div>")($rootScope);

            $rootScope.$digest();

            expect(element.attr('disabled')).toBeFalsy();

            $rootScope.$broadcast('loading-started');
            $rootScope.$digest();

            expect(element.attr('disabled')).toBeTruthy();

            $rootScope.$broadcast('loading-complete');
            $rootScope.$digest();

            expect(element.attr('disabled')).toBeFalsy();
        });
    });
});
