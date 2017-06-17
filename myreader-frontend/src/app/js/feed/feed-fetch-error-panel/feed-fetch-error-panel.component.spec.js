describe('src/app/js/feed/feed-fetch-error-panel/feed-fetch-error-panel.component.spec.js', function () {

    describe('with html', function () {

        var testUtils = require('../../shared/test-utils');

        var myFeedFetchError = testUtils.componentMock('myFeedFetchError');

        var scope, compile, element, myOnError;

        beforeEach(require('angular').mock.module('myreader', myFeedFetchError));

        beforeEach(inject(function ($rootScope, $compile) {
            scope = $rootScope.$new();
            compile = $compile;

            myOnError = jasmine.createSpy('myOnError');

            scope.id = '2';
            scope.myOnError = myOnError;

            element = compile('<my-feed-fetch-error-panel ' +
                'my-id="id" ' +
                'my-on-error="myOnError(error)">' +
                '</my-feed-fetch-error-panel>')(scope);

            scope.$digest();
            element.find('md-icon')[0].click();
        }));

        it('should render title', function () {
            expect(element.find('h2')[0].innerText).toContain('Fetch errors');
        });

        it('should show expand icon', function () {
            element = compile('<my-feed-fetch-error-panel></my-feed-fetch-error-panel>')(scope);
            scope.$digest();

            expect(element.find('md-icon')[0].innerText).toContain('expand_more');
        });

        it('should not render feed fetch error component when panel initialized', function () {
            element = compile('<my-feed-fetch-error-panel></my-feed-fetch-error-panel>')(scope);
            scope.$digest();

            expect(element.find('my-error-exclusion').length).toEqual(0);
        });

        it('should show less icon', function () {
            expect(element.find('md-icon')[0].innerText).toContain('expand_less');
        });

        it('should render feed fetch error component when show more icon clicked', function () {
            expect(element.find('my-feed-fetch-error').length).toEqual(1);
        });

        it('should forward bindings to feed fetch error component', function () {
            expect(myFeedFetchError.bindings.myId).toEqual(scope.id);
        });

        it('should emit myOnError event from feed fetch error component', function () {
            myFeedFetchError.bindings.myOnError({ error: 'expected error'});

            expect(myOnError).toHaveBeenCalledWith('expected error');
        });

        it('should hide feed fetch error component when show less icon clicked', function () {
            element.find('md-icon')[0].click();

            expect(element.find('md-icon')[0].innerText).toContain('expand_more');
            expect(element.find('my-feed-fetch-error')[0].classList).toContain('ng-hide');
        });
    });
});
