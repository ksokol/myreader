import {mock, mockNgRedux, filterMock, componentMock} from '../shared/test-utils'

class ListItem {

    constructor(el) {
        this.el = angular.element(el)
    }

    title() {
        return this.el.find('h3').text()
    }

    createdAt() {
        return this.el.find('h4').text()
    }

    click() {
        this.el.find('button')[0].click()
    }
}

class ListItems {

    constructor(el) {
        this.el = angular.element(el)
    }

    itemAtIndex(index) {
        return new ListItem(this.el[index])
    }
}

describe('src/app/js/subscription/subscription-list.component.spec.js', () => {

    let rootScope, scope, compile, ngReduxMock, element

    describe('', () => {

        beforeEach(() => angular.mock.module('myreader', filterMock('timeago'), mockNgRedux()))

        beforeEach(inject(($rootScope, $compile, $ngRedux) => {
            rootScope = $rootScope
            compile = $compile
            ngReduxMock = $ngRedux
            scope = $rootScope.$new(true)

            ngReduxMock.setState({
                subscription: {
                    subscriptions: [
                        {uuid: '1', title: 'title1', createdAt: '2017-12-29'},
                        {uuid: '2', title: 'title2', createdAt: '2017-11-30'},
                        {uuid: '3', title: 'title3', createdAt: '2017-10-29'}
                    ]
                }
            })

            element = $compile('<my-subscription-list></my-subscription-list>')(scope)
            scope.$digest()
        }))

        it('should render subscriptions', () => {
            const items = new ListItems(element.find('md-list-item'))

            expect(items.el.length).toEqual(3)

            expect(items.itemAtIndex(0).title()).toEqual('title1')
            expect(items.itemAtIndex(0).createdAt()).toEqual('timeago("2017-12-29")')

            expect(items.itemAtIndex(1).title()).toEqual('title2')
            expect(items.itemAtIndex(1).createdAt()).toEqual('timeago("2017-11-30")')

            expect(items.itemAtIndex(2).title()).toEqual('title3')
            expect(items.itemAtIndex(2).createdAt()).toEqual('timeago("2017-10-29")')
        })

        it('should navigate to subscription detail page on click', () => {
            const items = new ListItems(element.find('md-list-item'))
            items.itemAtIndex(2).click()

            expect(ngReduxMock.getActions()[0]).toContainObject({type: 'ROUTE_CHANGED', route: ['app', 'subscription'], query: {uuid: '3'}})
        })

        it('should render subscriptions matching search value', () => {
            ngReduxMock.setState({
                router: {
                    query: {q: 'title2'}
                }
            })
            scope.$digest()

            const items = new ListItems(element.find('md-list-item'))

            expect(items.el.length).toEqual(1)
            expect(items.itemAtIndex(0).title()).toEqual('title2')
        })
    })

    describe('', () => {

        const listPage = componentMock('myListPage')

        beforeEach(() => angular.mock.module('myreader', listPage, mockNgRedux()))

        beforeEach(inject(($rootScope, $compile, $state, $ngRedux) => {
            rootScope = $rootScope
            compile = $compile
            ngReduxMock = $ngRedux
            scope = $rootScope.$new(true)

            element = $compile('<my-subscription-list></my-subscription-list>')(scope)
            scope.$digest()
        }))

        it('should update url when search executed', () => {
            listPage.bindings.myOnSearch({params: {q: 'b'}})

            expect(ngReduxMock.getActions()[0]).toContainObject({type: 'ROUTE_CHANGED', route: ['app', 'subscriptions'], query: {q: 'b'}})
        })

        it('should refresh state', () => {
            ngReduxMock.clearActions()
            listPage.bindings.myOnRefresh()

            expect(ngReduxMock.getActionTypes()).toEqual(['GET_SUBSCRIPTIONS'])
        })
    })
})
