import {mockNgRedux, multipleReactComponents, reactComponent} from '../shared/test-utils'

describe('src/app/js/entry/entry-list.component.spec.js', () => {

  let scope, element, compile, ngReduxMock, loadMore, entries

  beforeEach(() => {
    loadMore = reactComponent('EntryListLoadMore')
    entries = multipleReactComponents('EntryAutoFocus')

    angular.mock.module('myreader', loadMore, entries, mockNgRedux())
  })

  beforeEach(inject(($rootScope, $compile, $ngRedux) => {
    ngReduxMock = $ngRedux
    compile = $compile
    scope = $rootScope.$new(true)

    ngReduxMock.setState({
      entry: {
        entries: [{uuid: '1'}, {uuid: '2'}, {uuid: '3'}],
        loading: false,
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

    expect(entries.bindings).toContainObject([
      {item: {uuid: '1'}, showEntryDetails: false, isDesktop: false, focusUuid: '2'},
      {item: {uuid: '2'}, showEntryDetails: false, isDesktop: false, focusUuid: '2'},
      {item: {uuid: '3'}, showEntryDetails: false, isDesktop: false, focusUuid: '2'}
    ])
    expect(loadMore.bindings.disabled).toEqual(false)
  })

  it('should pass expected props "showEntryDetails" and "isDesktop" to entry components', () => {
    ngReduxMock.setState({
      settings: {
        showEntryDetails: true
      },
      common: {
        mediaBreakpoint: 'desktop'
      },
      entry: {
        ...ngReduxMock.getState().entry,
        loading: true
      }
    })
    element = compile('<my-entry-list></my-entry-list>')(scope)

    scope.$digest()

    expect(entries.bindings).toContainObject([
      {item: {uuid: '1'}, showEntryDetails: true, isDesktop: true},
      {item: {uuid: '2'}, showEntryDetails: true, isDesktop: true},
      {item: {uuid: '3'}, showEntryDetails: true, isDesktop: true}
    ])
    expect(loadMore.bindings.disabled).toEqual(true)
  })

  it('should dispatch action for next page when load more button clicked', () => {
    element = compile('<my-entry-list></my-entry-list>')(scope)
    scope.$digest()

    loadMore.bindings.onClick();

    expect(ngReduxMock.getActionTypes()).toEqual(['GET_ENTRIES'])
    expect(ngReduxMock.getActions()[0].url).toContain('expected-path')
  })

  it('should dispatch action for next page when load more button becomes visible', () => {
    element = compile('<my-entry-list></my-entry-list>')(scope)
    scope.$digest()

    loadMore.bindings.onIntersection();

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
