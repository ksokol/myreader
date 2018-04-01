import {componentMock, filterMock, mockNgRedux} from 'shared/test-utils'

describe('src/app/js/feed/feed-list.component.spec.js', () => {

    const feeds = [{
        uuid: 1,
        title: 'title 1',
        hasErrors: false,
        createdAt: 'createdAt 1'
    }, {
        uuid: 2,
        title: 'title 2',
        hasErrors: true,
        createdAt: 'createdAt 2'
    }]

    let rootScope, scope, element, page, ngReduxMock

    const Feed = el => {
        return {
            title: () => el.find('h3')[0],
            createdAt: () => el.find('span')[0],
            errorIcon: () => {
                const item = el.find('my-icon')[0]
                return item ? angular.element(item) : undefined
            },
            click: () => el.triggerHandler('click')
        }
    }

    const PageObject = el => {
        return {
            feedList: () => {
                const feeds = []
                const items = el[0].querySelectorAll('.feed-list__item')
                for (let i=0; i < items.length; i++) {
                    feeds.push(new Feed(angular.element(items[i])))
                }
                return feeds
            }
        }
    }

    const givenState = (router = {}) => {
        ngReduxMock.setState({router})
        scope.$digest()
    }

    describe('', () => {

        beforeEach(angular.mock.module('myreader', filterMock('timeago'), mockNgRedux()))

        beforeEach(inject(($rootScope, $compile, $ngRedux) => {
            rootScope = $rootScope
            scope = $rootScope.$new(true)
            ngReduxMock = $ngRedux
            ngReduxMock.setState({admin: {feeds}})

            element = $compile('<my-feed-list></my-feed-list>')(scope)
            page = new PageObject(element)
            scope.$digest()
        }))

        it('should show feed items', () => {
            expect(page.feedList()[0].title().innerText).toEqual('title 1')
            expect(page.feedList()[1].title().innerText).toEqual('title 2')
        })

        it('should sanitize feed title', () => {
            expect(page.feedList()[0].title().classList).toContain('ng-binding')
        })

        it('should show error icon when feed has fetch errors', () => {
            expect(page.feedList()[0].errorIcon()).toBeUndefined()
            expect(page.feedList()[1].errorIcon()).toBeDefined()
        })

        it('should render error icon when feed err', () => {
            expect(page.feedList()[1].errorIcon().attr('my-type')).toEqual('error')
        })

        it('should pass feed creation date to timeago pipe', () => {
            expect(page.feedList()[0].createdAt().innerText).toContain('timeago("createdAt 1")')
        })

        it('should navigate to feed detail page', () => {
            page.feedList()[1].click()
            scope.$digest()

            expect(ngReduxMock.getActions()[0]).toContainObject({type: 'ROUTE_CHANGED', route: ['admin', 'feed-detail'], query: {uuid: 2}})
        })

        it('should filter feeds', () => {
            givenState({query: {q: 'title 1'}})
            expect(page.feedList().length).toEqual(1)
            expect(page.feedList()[0].title().innerText).toEqual('title 1')

            givenState({query: {q: 'title 2'}})
            expect(page.feedList().length).toEqual(1)
            expect(page.feedList()[0].title().innerText).toEqual('title 2')
        })

        it('should clear filter', () => {
            givenState({query: {q: 'title 1'}})
            expect(page.feedList().length).toEqual(1)

            givenState({query: {}})
            expect(page.feedList().length).toEqual(2)
        })
    })

    describe('', () => {

        let listPage

        beforeEach(() => {
            listPage = componentMock('myListPage')
            angular.mock.module('myreader', listPage, mockNgRedux())
        })

        beforeEach(inject(($rootScope, $compile, $ngRedux) => {
            rootScope = $rootScope
            scope = $rootScope.$new(true)
            ngReduxMock = $ngRedux

            ngReduxMock.setState({admin: {feeds}})

            element = $compile('<my-feed-list></my-feed-list>')(scope)
            page = new PageObject(element)
            scope.$digest()
        }))

        it('should update url when search executed', () => {
            listPage.bindings.myOnSearch({params: {q: 'b'}})
            scope.$digest()

            expect(ngReduxMock.getActions()[0]).toContainObject({type: 'ROUTE_CHANGED', route: ['admin', 'feed'], query: {q: 'b'}})
        })

        it('should refresh state', () => {
            listPage.bindings.myOnRefresh()
            scope.$digest()

            expect(ngReduxMock.getActionTypes()).toEqual(['GET_FEEDS'])
        })
    })
})
