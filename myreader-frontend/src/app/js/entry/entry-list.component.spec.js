import {mockNgRedux, reactComponent} from '../shared/test-utils'

describe('src/app/js/entry/entry-list.component.spec.js', () => {

  let ngReduxMock, entryList

  beforeEach(() => {
    entryList = reactComponent('EntryList')

    angular.mock.module('myreader', entryList, mockNgRedux())
  })

  beforeEach(inject(($rootScope, $compile, $ngRedux) => {
    ngReduxMock = $ngRedux
    const scope = $rootScope.$new(true)

    ngReduxMock.setState({
      entry: {
        entries: [{uuid: '1'}, {uuid: '2'}, {uuid: '3'}],
        loading: true,
        links: {
          next: {
            path: 'expected-path',
            query: {}
          }
        },
        entryInFocus: '2'
      },
      settings: {
        showEntryDetails: true
      },
      common: {
        mediaBreakpoint: 'desktop'
      }
    })

    $compile('<my-entry-list></my-entry-list>')(scope)
    scope.$digest()
  }))

  it('should pass properties to entry list component', () => {
    expect(entryList.bindings).toContainObject({
      links: {
        next: {
          path: 'expected-path',
          query: {}
        }
      },
      entries: [
        {uuid: '1'},
        {uuid: '2'},
        {uuid: '3'}
      ],
      focusUuid: '2',
      showEntryDetails: true,
      isDesktop: true,
      loading: true
    })
  })

  it('should dispatch action for next page when prop "onLoadMore" function triggered', () => {
    entryList.bindings.onLoadMore({path: 'expected-path', query: {}})

    expect(ngReduxMock.getActionTypes()).toEqual(['GET_ENTRIES'])
    expect(ngReduxMock.getActions()[0].url).toContain('expected-path')
  })

  it('should dispatch ENTRY_PATCH action when prop "onChangeEntry" function triggered', () => {
    entryList.bindings.onChangeEntry({uuid: '1', seen: true, tag: 'expected tag'})

    expect(ngReduxMock.getActionTypes()).toEqual(['PATCH_ENTRY'])
    expect(ngReduxMock.getActions()[0].url).toContain('/api/2/subscriptionEntries/1')
    expect(ngReduxMock.getActions()[0]).toContainObject({type: 'PATCH_ENTRY', body: {seen: true, tag: 'expected tag'}})
  })
})
