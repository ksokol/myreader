describe('src/app/js/feed/feed-fetch-error-panel/feed-fetch-error/feed-fetch-error-list-item.component.spec.js', function () {

    describe('with html', function () {

        var testUtils = require('../../../shared/test-utils');

        var element;

        beforeEach(require('angular').mock.module('myreader', testUtils.filterMock('timeago')));

        beforeEach(inject(function ($rootScope, $compile) {
            var scope = $rootScope.$new();

            scope.item = {
                "uuid": "1",
                "message": "error1",
                "retainDays": 7,
                "createdAt": "2017-04-28T18:01:03Z",
                "links": []
            };

            element = $compile('<my-feed-fetch-error-list-item my-item="item"></my-feed-fetch-error-list-item>')(scope);
            scope.$digest();
        }));

        it('should render message', function () {
            expect(element.find('p')[0].innerText).toEqual('error1');
        });

        it('should render createdAt', function () {
            expect(element.find('p')[1].innerText).toEqual('timeago("2017-04-28T18:01:03Z")');
        });
    });
});
