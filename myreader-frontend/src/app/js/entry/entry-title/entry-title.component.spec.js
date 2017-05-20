describe('myEntryTitle', function () {

    var testUtils = require('../../shared/test-utils');

    var item, timeAgoFilter;

    beforeEach(require('angular').mock.module('myreader', function($provide) {
        testUtils.mock('$window')($provide);

        timeAgoFilter = jasmine.createSpy('timeAgoFilter');
        timeAgoFilter.and.callFake(function (value) {
            return 'timeago("' + value + '")';
        });
        $provide.value('timeagoFilter', timeAgoFilter);
    }));

    beforeEach(function () {
        item = {
            title: 'entry title',
            origin: 'entry url',
            createdAt: 'creation date',
            feedTitle: 'feed title'
        };
    });

    describe('with html', function () {

        var scope, element;

        beforeEach(inject(function ($rootScope, $compile) {
            scope = $rootScope.$new();
            scope.item = item;

            element = $compile('<my-entry-title my-item="item"></my-entry-title>')(scope);
            scope.$digest();
        }));

        it('should render entry title', function () {
            expect(element.find('h3')[0].innerText).toEqual(item.title);
        });

        it('should render html encoded entry title', inject(function ($compile) {
            item.title = '&quot;entry title&quot;';
            element = $compile('<my-entry-title my-item="item"></my-entry-title>')(scope);
            scope.$digest();

            expect(element.find('h3')[0].innerText).toEqual('"entry title"');
        }));

        it('should render feed title', function () {
            expect(element.find('h4').find('span')[0].innerText).toEqual(item.feedTitle);
        });

        it('should render html encoded feed title', inject(function ($compile) {
            item.feedTitle = '&quot;feed title&quot;';
            element = $compile('<my-entry-title my-item="item"></my-entry-title>')(scope);
            scope.$digest();

            expect(element.find('h4').find('span')[0].innerText).toEqual('"feed title"');
        }));

        it('should open entry url when clicked on entry title', inject(function ($window) {
            var windowAttributes = {};
            $window.open = jasmine.createSpy('open');
            $window.open.and.returnValue(windowAttributes);

            element.find('h3')[0].click();

            expect(windowAttributes.location).toBe('entry url');
        }));

        it('should open entry url safely', inject(function ($window) {
            var windowAttributes = {};
            $window.open = jasmine.createSpy('open');
            $window.open.and.returnValue(windowAttributes = {});

            element.find('h3')[0].click();

            expect(windowAttributes.opener).toBeNull();
        }));

        it('should render creation date with timeago filter before feed title', function () {
            expect(element.find('h4')[0].innerText).toEqual('timeago("creation date") on feed title');
        });
    });
});
