import {filterMock} from '../../shared/test-utils';

describe('src/app/js/entry/entry-title/entry-title.component.spec.js', () => {

    let scope, element, item;

    beforeEach(angular.mock.module('myreader', filterMock('timeago')));

    beforeEach(() => {
        item = {
            title: 'entry title',
            origin: 'entry url',
            createdAt: 'creation date',
            feedTitle: 'feed title'
        };
    });

    beforeEach(inject(($rootScope, $compile) => {
        scope = $rootScope.$new();
        scope.item = item;

        element = $compile('<my-entry-title my-item="item"></my-entry-title>')(scope);
        scope.$digest();
    }));

    it('should render entry title', () => {
        expect(element.find('h3')[0].innerText.trim()).toEqual(item.title);
    });

    it('should render feed title', () => {
        expect(element.find('h4').find('span')[0].innerText).toEqual(item.feedTitle);
    });

    it('should render html encoded feed title', inject($compile => {
        item.feedTitle = '&quot;feed title&quot;';
        element = $compile('<my-entry-title my-item="item"></my-entry-title>')(scope);
        scope.$digest();

        expect(element.find('h4').find('span')[0].innerText).toEqual('"feed title"');
    }));

    it('should open entry url safely', () => {
        const title = element.find('a')[0];

        expect(title.attributes['ng-href'].value).toEqual('entry url');
        expect(title.attributes['target'].value).toEqual('_blank');
        expect(title.attributes['rel'].value).toEqual('noopener noreferrer');
    });

    it('should render creation date with timeago filter before feed title', () => {
        expect(element.find('h4')[0].innerText).toEqual('timeago("creation date") on feed title');
    });
});
