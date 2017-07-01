describe('src/app/js/feed/feed-fetch-error-panel/feed-fetch-error-panel.component.spec.js', function () {

    describe('with html', function () {

        var testUtils = require('../../shared/test-utils');

        var myFeedFetchError = testUtils.componentMock('myFeedFetchError');

        var scope, compile, myOnError, page;

        var Icon = function (el) {
            return {
                el: el,
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
                errorExclusion: function () {
                    return el.find('my-error-exclusion')[0];
                },
                feedFetchError: function () {
                    return el.find('my-feed-fetch-error')[0];
                }
            }
        };

        beforeEach(require('angular').mock.module('myreader', myFeedFetchError));

        beforeEach(inject(function ($rootScope, $compile) {
            scope = $rootScope.$new();
            compile = $compile;

            myOnError = jasmine.createSpy('myOnError');

            scope.id = '2';
            scope.myOnError = myOnError;

            var element = compile('<my-feed-fetch-error-panel ' +
                'my-id="id" ' +
                'my-on-error="myOnError(error)">' +
                '</my-feed-fetch-error-panel>')(scope);

            scope.$digest();
            page = new PageObject(element);
            page.expandIcon().click();
        }));

        it('should render title', function () {
            expect(page.title().innerText).toContain('Fetch errors');
        });

        it('should show expand icon', function () {
            var element = compile('<my-feed-fetch-error-panel></my-feed-fetch-error-panel>')(scope);
            scope.$digest();
            page = new PageObject(element);

            expect(page.expandIcon().iconType()).toEqual('expand-more');
        });

        it('should not render feed fetch error component when panel initialized', function () {
            var element = compile('<my-feed-fetch-error-panel></my-feed-fetch-error-panel>')(scope);
            scope.$digest();
            page = new PageObject(element);

            expect(page.errorExclusion()).toBeUndefined();
        });

        it('should show less icon', function () {
            expect(page.expandIcon().iconType()).toEqual('expand-less');
        });

        it('should render feed fetch error component when show more icon clicked', function () {
            expect(page.feedFetchError()).toBeDefined();
        });

        it('should forward bindings to feed fetch error component', function () {
            expect(myFeedFetchError.bindings.myId).toEqual(scope.id);
        });

        it('should emit myOnError event from feed fetch error component', function () {
            myFeedFetchError.bindings.myOnError({ error: 'expected error'});

            expect(myOnError).toHaveBeenCalledWith('expected error');
        });

        it('should hide feed fetch error component when show less icon clicked', function () {
            page.expandIcon().click();

            expect(page.expandIcon().iconType()).toEqual('expand-more');
            expect(page.feedFetchError().classList).toContain('ng-hide');
        });
    });
});
