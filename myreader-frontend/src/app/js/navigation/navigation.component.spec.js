import {componentMock, mockNgRedux} from '../shared/test-utils'

describe('src/app/js/navigation/navigation.component.spec.js', () => {

    let scope, compile, ngReduxMock

    beforeEach(() => angular.mock.module('myreader', componentMock('myNavigationSubscriptionsItem'), mockNgRedux()))

    beforeEach(inject(($rootScope, $compile, $ngRedux) => {
        scope = $rootScope.$new(true)
        compile = $compile
        ngReduxMock = $ngRedux
    }))

    function collectLinkTexts(element) {
        const aTags = element.find('span')
        const linkTexts = []
        for (let i = 0; i <aTags.length; i++) {
            linkTexts.push(aTags[i].innerText)
        }
        return linkTexts
    }

    function clickOnAllNavigationItems(element) {
        const aTags = element.find('li')
        for (let i = 0; i < aTags.length; i++) {
            aTags[i].click()
        }
        return ngReduxMock.getActions().filter(action => action.route).map(action => action.route)
    }

    it('should render user navigation', () => {
        const element = compile('<my-navigation></my-navigation>')(scope)
        scope.$digest()

        expect(element.find('my-navigation-subscriptions-item').length).toEqual(1)
        expect(collectLinkTexts(element)).toEqual(['Subscriptions', 'Bookmarks', 'Settings', 'Add subscription', 'Logout'])
    })

    it('should render admin navigation', () => {
        ngReduxMock.setState({security: {authorized: true, role: 'ROLE_ADMIN'}})
        const element = compile('<my-navigation></my-navigation>')(scope)
        scope.$digest()

        expect(element.find('my-navigation-subscriptions-item').length).toEqual(0)
        expect(collectLinkTexts(element)).toEqual(['Admin', 'Feeds', 'Logout'])
    })

    it('should route to component on item click', () => {
        const element = compile('<my-navigation></my-navigation>')(scope)
        scope.$digest()
        element.find('li')[2].click()

        expect(ngReduxMock.getActionTypes()).toEqual(['ROUTE_CHANGED'])
        expect(ngReduxMock.getActions()[0]).toContainActionData({route: ['app', 'settings']})
    })

    it('should route to configured user components', () => {
        const element = compile('<my-navigation></my-navigation>')(scope)
        scope.$digest()

        expect(clickOnAllNavigationItems(element))
            .toEqual([['app', 'subscriptions'], ['app', 'bookmarks'], ['app', 'settings'], ['app', 'subscription-add']])
    })

    it('should route to configured admin components', () => {
        ngReduxMock.setState({security: {authorized: true, role: 'ROLE_ADMIN'}})
        const element = compile('<my-navigation></my-navigation>')(scope)
        scope.$digest()

        expect(clickOnAllNavigationItems(element)).toEqual([['admin', 'overview'], ['admin', 'feed']])
    })

    it('should dispatch logout action when user clicks on logout button', () => {
        const element = compile('<my-navigation></my-navigation>')(scope)
        scope.$digest()
        element[0].querySelector('li:last-of-type').click()

        expect(ngReduxMock.getActionTypes()).toEqual(['POST_LOGOUT'])
    })

    it('should dispatch logout action when admin clicks on logout button', () => {
        ngReduxMock.setState({security: {authorized: true, role: 'ROLE_ADMIN'}})
        const element = compile('<my-navigation></my-navigation>')(scope)
        scope.$digest()
        element[0].querySelector('li:last-of-type').click()

        expect(ngReduxMock.getActionTypes()).toEqual(['POST_LOGOUT'])
    })
})
