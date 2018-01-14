import {componentMock, mockNgRedux} from '../shared/test-utils'

describe('src/app/js/navigation/navigation.compnent.spec.js', () => {

    let scope, compile, ngReduxMock

    beforeEach(() => angular.mock.module('myreader', componentMock('myNavigationSubscriptionsItem'), mockNgRedux()))

    beforeEach(inject(($rootScope, $compile, $ngRedux) => {
        scope = $rootScope.$new(true)
        compile = $compile
        ngReduxMock = $ngRedux
    }))

    function collectLinkTexts(element) {
        const aTags = element.find('a')
        const linkTexts = []
        for (let i=0; i <aTags.length; i++) {
            linkTexts.push(aTags[i].innerText)
        }
        return linkTexts
    }

    it('should render user navigation', () => {
        const element = compile('<my-navigation></my-navigation>')(scope)
        scope.$digest()

        expect(element.find('my-navigation-subscriptions-item').length).toEqual(1)
        expect(collectLinkTexts(element)).toEqual(['Subscriptions', 'Bookmarks', 'Settings', 'Add subscription'])
        expect(element.find('my-logout').length).toEqual(1)
    })

    it('should render admin navigation', () => {
        ngReduxMock.setState({security: {authorized: true, role: 'admin'}})
        const element = compile('<my-navigation></my-navigation>')(scope)
        scope.$digest()

        expect(element.find('my-navigation-subscriptions-item').length).toEqual(0)
        expect(collectLinkTexts(element)).toEqual(['Admin', 'Feeds'])
        expect(element.find('my-logout').length).toEqual(1)
    })
})
