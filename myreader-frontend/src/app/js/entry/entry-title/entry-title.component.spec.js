import {filterMock} from '../../shared/test-utils'

describe('src/app/js/entry/entry-title/entry-title.component.spec.js', () => {

    let scope, element, item

    beforeEach(angular.mock.module('myreader', filterMock('timeago')))

    beforeEach(() => {
        item = {
            title: 'entry title',
            origin: 'entry url',
            createdAt: 'creation date',
            feedTitle: 'feed title'
        }
    })

    beforeEach(inject(($rootScope, $compile) => {
        scope = $rootScope.$new(true)
        scope.item = item

        element = $compile('<my-entry-title my-item="item"></my-entry-title>')(scope)
        scope.$digest()
    }))

    it('should render entry title', () => {
        expect(element[0].querySelector('h3').textContent.trim()).toEqual('entry title')
    })

    it('should render feed title', () => {
        expect(element[0].querySelector('h4 > span').textContent).toEqual(item.feedTitle)
    })

    it('should render html encoded feed title', inject($compile => {
        item.feedTitle = '&quotfeed title&quot'
        element = $compile('<my-entry-title my-item="item"></my-entry-title>')(scope)
        scope.$digest()

        expect(element[0].querySelector('h4 > span').textContent).toEqual('"feed title"')
    }))

    it('should open entry url safely', () => {
        const title = element[0].querySelector('a')

        expect(title.attributes['ng-href'].value).toEqual('entry url')
        expect(title.attributes['target'].value).toEqual('_blank')
        expect(title.attributes['rel'].value).toEqual('noopener noreferrer')
    })

    it('should render creation date with timeago filter before feed title', () => {
        expect(element[0].querySelector('h4').textContent).toEqual('timeago("creation date") on feed title')
    })
})
