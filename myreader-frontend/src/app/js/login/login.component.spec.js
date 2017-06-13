describe('src/app/js/login/login.component.spec.js', function () {

    describe('with html', function () {

        var testUtils = require('../shared/test-utils');

        var scope, element, httpBackend, $state;

        beforeEach(require('angular').mock.module('myreader', testUtils.mock('$state')));

        beforeEach(inject(function ($rootScope, $compile, _$httpBackend_, _$state_) {
            scope = $rootScope.$new();

            httpBackend = _$httpBackend_;
            $state = _$state_;
            $state.go = jasmine.createSpy('$state.go()');

            element = $compile('<my-login></my-login>')(scope);

            angular.element(element.find('input')[0]).val('email').triggerHandler('input');
            angular.element(element.find('input')[1]).val('password').triggerHandler('input');
            scope.$digest();
        }));

        afterEach(function() {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should post credentials without remember me flag', function () {
            httpBackend.expectPOST('check', 'username=email&password=password&remember-me=undefined', function(headers) {
                return headers['Content-Type'] === 'application/x-www-form-urlencoded';
            }).respond(200, '');

            element.find('button')[0].click();
            httpBackend.flush();
        });

        it('should post credentials with remember me flag', function () {
            httpBackend.expectPOST('check', 'username=email&password=password&remember-me=on', function(headers) {
                return headers['Content-Type'] === 'application/x-www-form-urlencoded';
            }).respond(200, '');

            element.find('md-checkbox').triggerHandler('click');
            element.find('button')[0].click();
            httpBackend.flush();
        });

        it('should navigate to admin overview page when X-MY-AUTHORITIES header contains admin role', function () {
            httpBackend.whenPOST('check').respond(function() {
                return [200, undefined, {'X-MY-AUTHORITIES': 'ROLE_ADMIN'}];
            });
            element.find('button')[0].click();
            httpBackend.flush();

            expect($state.go).toHaveBeenCalledWith('admin.overview');
        });

        it('should navigate to stream page when X-MY-AUTHORITIES header contains user role', function () {
            httpBackend.whenPOST('check').respond(200);
            element.find('button')[0].click();
            httpBackend.flush();

            expect($state.go).toHaveBeenCalledWith('app.entries');
        });

        it('should navigate to stream page when X-MY-AUTHORITIES is not present', function () {
            httpBackend.whenPOST('check').respond(function() {
                return [200, undefined, {'X-MY-AUTHORITIES': 'ROLE_USER'}];
            });
            element.find('button')[0].click();
            httpBackend.flush();

            expect($state.go).toHaveBeenCalledWith('app.entries');
        });

        it('should indicate wrong credentials on page', function () {
            httpBackend.whenPOST('check').respond(404);
            element.find('button')[0].click();
            httpBackend.flush();

            expect(element.find('my-notification-panel').find('span')[0].innerText).toEqual('Username or password wrong');
        });

        it('should disable elements on page while post request is pending', function () {
            httpBackend.whenPOST('check').respond(404);
            element.find('button')[0].click();

            expect(element.find('button')[0].disabled).toBe(true);
            expect(element.find('input')[0].disabled).toBe(true);
            expect(element.find('input')[1].disabled).toBe(true);
            expect(element.find('md-checkbox')[0].disabled).toBe(true);
            httpBackend.flush();
        });

        it('should enable elements on page when post request finished', function () {
            httpBackend.whenPOST('check').respond(404);
            element.find('button')[0].click();

            httpBackend.flush();
            expect(element.find('button')[0].disabled).toBe(false);
            expect(element.find('input')[0].disabled).toBe(false);
            expect(element.find('input')[1].disabled).toBe(false);
            expect(element.find('md-checkbox')[0].disabled).toBe(false);
        });
    });
});
