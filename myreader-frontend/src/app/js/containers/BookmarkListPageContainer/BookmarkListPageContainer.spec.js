import React from 'react'
import {mount} from 'enzyme'
import {Provider} from 'react-redux'
import {createMockStore} from '../../shared/test-utils'
import BookmarkListPageContainer from './BookmarkListPageContainer'

describe('BookmarkListPageContainer', () => {

  let store

  const createContainer = () => {
    const wrapper = mount(
      <Provider store={store}>
        <BookmarkListPageContainer />
      </Provider>
    )
    return wrapper.find(BookmarkListPageContainer).children().first()
  }

  beforeEach(() => {
    store = createMockStore()
    store.setState({
      router: {
        query: {
          entryTagEqual: 'tag'
        }
      },
      entry: {
        entries: [],
        links: {},
        loading: false,
        tags: ['tag1', 'tag2']
      }
    })
  })

  it('should initialize component with given props', () => {
    expect(createContainer().props()).toContainObject({
      entryTags: ['tag1', 'tag2'],
      router: {
        query: {
          entryTagEqual: 'tag'
        }
      }
    })
  })

  it('should dispatch action when prop function "onSearchChange" triggered', () => {
    createContainer().props().onSearchChange({entryTagEqual: 'expected'})

    expect(store.getActions()[0]).toContainObject({
      type: 'ROUTE_CHANGED',
      route: ['app', 'bookmarks'],
      query: {entryTagEqual: 'expected'}
    })
  })

  it('should dispatch action when prop function "onRefresh" triggered', () => {
    createContainer().props().onRefresh({a: 'b'})

    expect(store.getActionTypes()).toContainObject(['GET_ENTRIES'])
    expect(store.getActions()[0].url).toContain('a=b')
  })

  it('should dispatch action for next page when prop function "onLoadMore" triggered', () => {
    createContainer().props().onLoadMore({path: 'expected-path', query: {}})

    expect(store.getActionTypes()).toEqual(['GET_ENTRIES'])
    expect(store.getActions()[0].url).toContain('expected-path')
  })

  it('should dispatch ENTRY_PATCH action when prop function "onChangeEntry" triggered', () => {
    createContainer().props().onChangeEntry({uuid: '1', seen: true, tag: 'expected tag'})

    expect(store.getActionTypes()).toEqual(['PATCH_ENTRY'])
    expect(store.getActions()[0].url).toContain('/api/2/subscriptionEntries/1')
    expect(store.getActions()[0]).toContainObject({type: 'PATCH_ENTRY', body: {seen: true, tag: 'expected tag'}})
  })
})
