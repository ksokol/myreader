import {componentMock, mockNgRedux, multipleReactComponents} from '../shared/test-utils'

describe('src/app/js/entry/entry-list.component.spec.js', () => {

  let rootScope, scope, element, compile, ngReduxMock, autoScroll, loadMore, entries

  beforeEach(() => {
    autoScroll = componentMock('myAutoScroll')
    loadMore = componentMock('myLoadMore')
    entries = multipleReactComponents('Entry')

    angular.mock.module('myreader', autoScroll, loadMore, entries, mockNgRedux())
  })

  beforeEach(inject(($rootScope, $compile, $ngRedux) => {
    rootScope = $rootScope
    ngReduxMock = $ngRedux
    compile = $compile
    scope = $rootScope.$new(true)

    ngReduxMock.setState({
      entry: {
        entries: [{uuid: '1'}, {uuid: '2'}, {uuid: '3'}],
        links: {
          next: {
            path: 'expected-path',
            query: {}
          }
        },
        entryInFocus: '2'
      },
      settings: {
        showEntryDetails: false
      }
    })
  }))

  it('should pass properties to child components', () => {
    element = compile('<my-entry-list></my-entry-list>')(scope)
    scope.$digest()

    expect(autoScroll.bindings.myScrollOn).toEqual({'data-uuid': '2'})
    expect(entries.bindings).toContainObject([
      {item: {uuid: '1'}, showEntryDetails: false, isDesktop: false},
      {item: {uuid: '2'}, showEntryDetails: false, isDesktop: false},
      {item: {uuid: '3'}, showEntryDetails: false, isDesktop: false}
    ])
    expect(loadMore.bindings.myNext).toEqual({path: 'expected-path', query: {}})
  })

  it('should pass expected props "showEntryDetails" and "isDesktop" to entry components', () => {
    ngReduxMock.setState({
      settings: {
        showEntryDetails: true
      },
      common: {
        mediaBreakpoint: 'desktop'
      }
    })
    element = compile('<my-entry-list></my-entry-list>')(scope)

    scope.$digest()

    expect(entries.bindings).toContainObject([
      {item: {uuid: '1'}, showEntryDetails: true, isDesktop: true},
      {item: {uuid: '2'}, showEntryDetails: true, isDesktop: true},
      {item: {uuid: '3'}, showEntryDetails: true, isDesktop: true}
    ])
  })

  it('should highlight entry that corresponds to entryInFocus', () => {
    element = compile('<my-entry-list></my-entry-list>')(scope)
    scope.$digest()

    const entries = element.find('ng-transclude').children()

    expect(entries[0].classList).not.toContain('focus')
    expect(entries[1].classList).toContain('focus')
    expect(entries[2].classList).not.toContain('focus')
  })

  it('should dispatch action for next page', () => {
    element = compile('<my-entry-list></my-entry-list>')(scope)
    scope.$digest()

    loadMore.bindings.myOnMore({more: loadMore.bindings.myNext})

    expect(ngReduxMock.getActionTypes()).toEqual(['GET_ENTRIES'])
    expect(ngReduxMock.getActions()[0].url).toContain('expected-path')
  })

  it('should purge entries from store when component is about to be destroyed', () => {
    element = compile('<my-entry-list></my-entry-list>')(scope)
    scope.$digest()

    scope.$destroy()
    expect(ngReduxMock.getActionTypes()).toEqual(['ENTRY_CLEAR'])
  })

  it('should dispatch ENTRY_PATCH action when prop "onChange" function triggered', () => {
    element = compile('<my-entry-list></my-entry-list>')(scope)
    scope.$digest()

    entries.bindings[0].onChange({uuid: '1', seen: true, tag: 'expected tag'})
    scope.$digest()

    expect(ngReduxMock.getActionTypes()).toEqual(['PATCH_ENTRY'])
    expect(ngReduxMock.getActions()[0].url).toContain('/api/2/subscriptionEntries/1')
    expect(ngReduxMock.getActions()[0]).toContainObject({type: 'PATCH_ENTRY', body: {seen: true, tag: 'expected tag'}})
  })
})
