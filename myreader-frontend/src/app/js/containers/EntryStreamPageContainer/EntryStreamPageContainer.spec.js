import React from 'react'
import {mount} from 'enzyme'
import {Provider} from 'react-redux'
import {createMockStore} from '../../shared/test-utils'
import EntryStreamPageContainer from './EntryStreamPageContainer'

describe('EntryStreamPageContainer', () => {

  let store

  const entryInFocus = () => ({uuid: 'uuid1', seen: false, origin: '1', createdAt: '1', title: '1', feedTitle: '1'})
  const nextFocusableEntry = () => ({uuid: 'uuid2', seen: false, origin: '2', createdAt: '2', title: '2', feedTitle: '2'})

  const createContainer = () => {
    const wrapper = mount(
      <Provider store={store}>
        <EntryStreamPageContainer />
      </Provider>
    )
    return wrapper.find(EntryStreamPageContainer).children().first()
  }

  beforeEach(() => {
    store = createMockStore()
    store.setState({
      router: {
        query: {
          q: 'title2'
        }
      },
      common: {
        mediaBreakpoint: 'tablet'
      },
      entry: {
        entries: [
          entryInFocus(),
          nextFocusableEntry()
        ],
        loading: false,
        links: {},
        entryInFocus: 'uuid1'
      }
    })
  })

  it('should initialize component with given props', () => {
    expect(createContainer().props()).toContainObject({
      router: {
        query: {
          q: 'title2'
        }
      },
      entryInFocus: entryInFocus(),
      nextFocusableEntry: nextFocusableEntry(),
      isDesktop: false
    })
  })

  it('should dispatch action when prop function "changeEntry" triggered', () => {
    createContainer().props().onChangeEntry({uuid: 'uuid1', seen: true, tag: 'expected tag'})

    expect(store.getActionTypes()).toEqual(['PATCH_ENTRY'])
    expect(store.getActions()[0]).toContainActionData({body: {seen: true, tag: 'expected tag'}})
    expect(store.getActions()[0].url).toMatch(/subscriptionEntries\/uuid1$/)
  })

  it('should dispatch action when prop function "onSearchChange" triggered', () => {
    createContainer().props().onSearchChange({a: 'b'})

    expect(store.getActionTypes()).toEqual(['ROUTE_CHANGED'])
    expect(store.getActions()[0]).toContainActionData({route: ['app', 'entries'], query: {a: 'b'}})
  })

  it('should dispatch action when prop function "previousEntry" triggered', () => {
    createContainer().props().previousEntry()

    expect(store.getActionTypes()).toEqual(['ENTRY_FOCUS_PREVIOUS'])
  })

  it('should dispatch action when prop function "entryFocusNext" triggered', () => {
    createContainer().props().entryFocusNext()

    expect(store.getActionTypes()).toEqual(['ENTRY_FOCUS_NEXT'])
  })

  it('should dispatch action when prop function "onRefresh" triggered', () => {
    createContainer().props().onRefresh({a: 'b'})

    expect(store.getActionTypes()).toEqual(['GET_SUBSCRIPTIONS', 'ROUTE_CHANGED'])
    expect(store.getActions()[1]).toContainActionData({
      route: ['app', 'entries'],
      query: {a: 'b'},
      options: {reload: true}
    })
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
