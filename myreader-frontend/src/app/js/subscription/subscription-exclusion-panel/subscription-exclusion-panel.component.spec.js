describe('src/app/js/subscription/subscription-exclusion-panel/subscription-exclusion-panel.component.spec.js', function () {

    describe('with html', function () {

        var testUtils = require('../../shared/test-utils');

        var mySubscriptionExclusion = testUtils.componentMock('mySubscriptionExclusion');

        var scope, compile, element, myOnError;

        beforeEach(require('angular').mock.module('myreader', mySubscriptionExclusion));

        beforeEach(inject(function ($rootScope, $compile) {
            scope = $rootScope.$new();
            compile = $compile;

            myOnError = jasmine.createSpy('myOnError');

            scope.id = '2';
            scope.disabled = true;
            scope.myOnError = myOnError;

            element = compile('<my-subscription-exclusion-panel ' +
                                'my-id="id" ' +
                                'my-disabled="disabled" ' +
                                'my-on-error="myOnError(error)">' +
                              '</my-subscription-exclusion-panel>')(scope);

            scope.$digest();
            element.find('md-icon')[0].click();
        }));

        it('should render title', function () {
            expect(element.find('h2')[0].innerText).toContain('Patterns to ignore');
        });

        it('should show expand icon', function () {
            element = compile('<my-subscription-exclusion-panel></my-subscription-exclusion-panel>')(scope);
            scope.$digest();

            expect(element.find('md-icon')[0].innerText).toContain('expand_more');
        });

        it('should not render subscription exclusion component when panel initialized', function () {
            element = compile('<my-subscription-exclusion-panel></my-subscription-exclusion-panel>')(scope);
            scope.$digest();

            expect(element.find('my-subscription-exclusion').length).toEqual(0);
        });

        it('should show less icon', function () {
            expect(element.find('md-icon')[0].innerText).toContain('expand_less');
        });

        it('should render subscription exclusion component when show more icon clicked', function () {
            expect(element.find('my-subscription-exclusion').length).toEqual(1);
        });

        it('should forward bindings to subscription exclusion component', function () {
            expect(mySubscriptionExclusion.bindings.myId).toEqual(scope.id);
            expect(mySubscriptionExclusion.bindings.myDisabled).toEqual(scope.disabled);
        });

        it('should emit myOnError event from subscription exclusion component', function () {
            mySubscriptionExclusion.bindings.myOnError({ error: 'expected error'});

            expect(myOnError).toHaveBeenCalledWith('expected error');
        });

        it('should hide subscription exclusion component when show less icon clicked', function () {
            element.find('md-icon')[0].click();

            expect(element.find('md-icon')[0].innerText).toContain('expand_more');
            expect(element.find('my-subscription-exclusion')[0].classList).toContain('ng-hide');
        });
    });
});
