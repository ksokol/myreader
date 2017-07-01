describe('src/app/js/subscription/subscription-exclusion-panel/subscription-exclusion-panel.component.spec.js', function () {

    describe('with html', function () {

        var testUtils = require('../../shared/test-utils');
        var angular = require('angular');

        var mySubscriptionExclusion = testUtils.componentMock('mySubscriptionExclusion');

        var scope, compile, myOnError, page;

        var Icon = function (el) {
            return {
                iconType: function () {
                    return el.attr('my-type');
                },
                click: function () {
                    el.triggerHandler('click');
                }
            }
        };

        var PageObject = function (el) {
            return {
                title: function () {
                    return el.find('h2')[0];
                },
                expandIcon: function () {
                    var icons = el.find('my-icon');
                    return new Icon(angular.element(icons[0]));
                },
                subscriptionExclusion: function () {
                    return el.find('my-subscription-exclusion')[0];
                }
            }
        };

        beforeEach(angular.mock.module('myreader', mySubscriptionExclusion));

        beforeEach(inject(function ($rootScope, $compile) {
            scope = $rootScope.$new();
            compile = $compile;

            myOnError = jasmine.createSpy('myOnError');

            scope.id = '2';
            scope.disabled = true;
            scope.myOnError = myOnError;

            var element = compile('<my-subscription-exclusion-panel ' +
                                'my-id="id" ' +
                                'my-disabled="disabled" ' +
                                'my-on-error="myOnError(error)">' +
                              '</my-subscription-exclusion-panel>')(scope);

            scope.$digest();
            page = new PageObject(element);
            page.expandIcon().click();
        }));

        it('should render title', function () {
            expect(page.title().innerText).toContain('Patterns to ignore');
        });

        it('should show expand icon', function () {
            var element = compile('<my-subscription-exclusion-panel></my-subscription-exclusion-panel>')(scope);
            scope.$digest();
            page = new PageObject(element);

            expect(page.expandIcon().iconType()).toEqual('expand-more');
        });

        it('should not render subscription exclusion component when panel initialized', function () {
            var element = compile('<my-subscription-exclusion-panel></my-subscription-exclusion-panel>')(scope);
            scope.$digest();

            expect(page.subscriptionExclusion()).toBeDefined();
        });

        it('should show less icon', function () {
            expect(page.expandIcon().iconType()).toEqual('expand-less');
        });

        it('should render subscription exclusion component when show more icon clicked', function () {
            var element = compile('<my-subscription-exclusion-panel></my-subscription-exclusion-panel>')(scope);
            scope.$digest();
            page = new PageObject(element);

            expect(page.subscriptionExclusion()).toBeUndefined();
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
            page.expandIcon().click();

            expect(page.expandIcon().iconType()).toEqual('expand-more');
            expect(page.subscriptionExclusion().classList).toContain('ng-hide');
        });
    });
});
