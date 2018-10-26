import React from 'react'
import {Provider} from 'react-redux'
import {mount} from 'enzyme'
import {createMockStore} from '../../shared/test-utils'
import EntryListContainer from './EntryListContainer'
import {EntryList} from '../../components'

describe('EntryListContainer', () => {

  let store

  const createShallow = () => {
    const wrapper = mount(
      <Provider store={store}>
        <EntryListContainer />
      </Provider>
    )
    return wrapper.find(EntryList)
  }

  beforeEach(() => {
    store = createMockStore()
    store.setState({
      entry: {
        entries: [
          {
            uuid: '1',
            title: 'title 1',
            feedTitle: 'feedTitle 1',
            origin: 'origin 1',
            seen: true,
            createdAt: 'createdAt 1'
          },
          {
            uuid: '2',
            title: 'title 2',
            feedTitle: 'feedTitle 2',
            origin: 'origin 2',
            seen: false,
            createdAt: 'createdAt 1'
          },
          {
            uuid: '3',
            title: 'title 3',
            feedTitle: 'feedTitle 3',
            origin: 'origin 3',
            seen: true,
            createdAt: 'createdAt 1'
          }
        ],
        loading: true,
        links: {
          next: {
            path: 'expected-path',
            query: {}
          }
        },
        entryInFocus: '2',
      },
      settings: {
        showEntryDetails: true
      },
      common: {
        mediaBreakpoint: 'desktop'
      }
    })
  })

  it('should pass properties to entry list component', () => {
    expect(createShallow().props()).toContainObject({
      links: {
        next: {
          path: 'expected-path',
          query: {}
        }
      },
      entries: [
        {
          uuid: '1',
          title: 'title 1',
          feedTitle: 'feedTitle 1',
          origin: 'origin 1',
          seen: true,
          createdAt: 'createdAt 1'
        },
        {
          uuid: '2',
          title: 'title 2',
          feedTitle: 'feedTitle 2',
          origin: 'origin 2',
          seen: false,
          createdAt: 'createdAt 1'
        },
        {
          uuid: '3',
          title: 'title 3',
          feedTitle: 'feedTitle 3',
          origin: 'origin 3',
          seen: true,
          createdAt: 'createdAt 1'
        }
      ],
      entryInFocus: {
        uuid: '2'
      },
      showEntryDetails: true,
      isDesktop: true,
      loading: true
    })
  })

  it('should dispatch action for next page when prop function "onLoadMore" triggered', () => {
    createShallow().props().onLoadMore({path: 'expected-path', query: {}})

    expect(store.getActionTypes()).toEqual(['GET_ENTRIES'])
    expect(store.getActions()[0].url).toContain('expected-path')
  })

  it('should dispatch ENTRY_PATCH action when prop function "onChangeEntry" triggered', () => {
    createShallow().props().onChangeEntry({uuid: '1', seen: true, tag: 'expected tag'})

    expect(store.getActionTypes()).toEqual(['PATCH_ENTRY'])
    expect(store.getActions()[0].url).toContain('/api/2/subscriptionEntries/1')
    expect(store.getActions()[0]).toContainObject({type: 'PATCH_ENTRY', body: {seen: true, tag: 'expected tag'}})
  })
})
