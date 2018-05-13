import {mockNgRedux} from '../../shared/test-utils'

class NavigationItem {

    constructor(el) {
        this.el = el
    }

    title() {
        return this.el.querySelector('span:first-of-type').textContent
    }
}

class Navigation {

    constructor(el) {
        this.el = el[0]
    }

    items() {
        const items = []
        this.el.querySelectorAll('my-navigation-subscription-item').forEach(it => items.push(new NavigationItem(it)))
        return items
    }

    itemAtPosition(index) {
        return this.items()[index]
    }

    item(title) {
        return this.items().find(it => it.title() === title)
    }
}

describe('src/app/js/navigation/subscriptions-item/subscriptions-item.component.spec.js', () => {

    const subscriptions = [
        {title: 'subscription 1', uuid: '1', tag: 'group 1', unseen: 2},
        {title: 'subscription 2', uuid: '2', tag: 'group 2', unseen: 1},
        {title: 'subscription 3', uuid: '3', tag: null, unseen: 0}
    ]

    let scope, element, ngReduxMock

    beforeEach(() => angular.mock.module('myreader', mockNgRedux()))

    beforeEach(inject(($rootScope, $compile, $ngRedux) => {
        scope = $rootScope.$new(true)
        ngReduxMock = $ngRedux

        ngReduxMock.setState({subscription: {subscriptions}, settings: {showUnseenEntries: false}})

        element = $compile('<my-navigation-subscriptions-item></my-navigation-subscriptions-item>')(scope)
        scope.$digest()
    }))

    it('should render all subscriptions', () => {
        const navigation = new Navigation(element)

        expect(navigation.items().length).toEqual(4)
        expect(navigation.itemAtPosition(0).title()).toEqual('all')
        expect(navigation.itemAtPosition(1).title()).toEqual('group 1')
        expect(navigation.itemAtPosition(2).title()).toEqual('group 2')
        expect(navigation.itemAtPosition(3).title()).toEqual('subscription 3')
    })

    it('should render subscriptions with at least one new entry', () => {
        ngReduxMock.setState({subscription: {subscriptions}, settings: {showUnseenEntries: true}})
        scope.$digest()

        const navigation = new Navigation(element)

        expect(navigation.items().length).toEqual(3)
        expect(navigation.itemAtPosition(0).title()).toEqual('all')
        expect(navigation.itemAtPosition(1).title()).toEqual('group 1')
        expect(navigation.itemAtPosition(2).title()).toEqual('group 2')
    })

    it('should construct comparison value for ng-repeat track by', () => {
        const trackBy = element.controller('myNavigationSubscriptionsItem').trackBy

        expect(trackBy({title: 'title', unseen: 1})).toEqual('{"title":"title","unseen":1,"subscriptions":null}')
        expect(trackBy({title: 'title', unseen: 1, subscriptions: [{}, {}]})).toEqual('{"title":"title","unseen":1,"subscriptions":2}')
    })
})
