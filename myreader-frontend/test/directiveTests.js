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

    describe("myDeleteKey", function() {
        var $compile,
            $rootScope,
            element;

        beforeEach(module('common.directives'));

        beforeEach(inject(function(_$compile_, _$rootScope_){
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $rootScope.searchKey = "test";
            $rootScope.broadcast = function() {};
            spyOn($rootScope, 'broadcast');
            element = $compile("<input my-delete-key='broadcast(\"search\", searchKey)' />")($rootScope);
            $rootScope.$digest();
        }));

        it('keyup with backspace', function () {
            var event = {
                "type": 'keyup',
                "which": 8
            };

            element.triggerHandler(event);
            expect($rootScope.broadcast).toHaveBeenCalledWith('search', 'test')
        });

        it('keypress with backspace', function () {
            var event = {
                "type": 'keypress',
                "which": 8
            };

            element.triggerHandler(event);
            expect($rootScope.broadcast).toHaveBeenCalledWith('search', 'test')
        });

        it('keypress with A', function () {
            var event = {
                "type": 'keypress',
                "which": 84
            };

            element.triggerHandler(event);
            expect($rootScope.broadcast).not.toHaveBeenCalled()
        });
    });

    describe("myEnterKey", function() {
        var $compile,
            $rootScope,
            element;

        beforeEach(module('common.directives'));

        beforeEach(inject(function(_$compile_, _$rootScope_){
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $rootScope.searchKey = "test";
            $rootScope.broadcast = function() {};
            spyOn($rootScope, 'broadcast');
            element = $compile("<input my-enter-key='broadcast(\"search\", searchKey)' />")($rootScope);
            $rootScope.$digest();
        }));

        it('keydown with enter', function () {
            var event = {
                "type": 'keydown',
                "which": 13
            };

            element.triggerHandler(event);
            expect($rootScope.broadcast).toHaveBeenCalledWith('search', 'test')
        });

        it('keypress with enter', function () {
            var event = {
                "type": 'keypress',
                "which": 13
            };

            element.triggerHandler(event);
            expect($rootScope.broadcast).toHaveBeenCalledWith('search', 'test')
        });

        it('keypress with A', function () {
            var event = {
                "type": 'keypress',
                "which": 84
            };

            element.triggerHandler(event);
            expect($rootScope.broadcast).not.toHaveBeenCalled()
        });
    });
});
