import React from 'react'
import {mount} from 'enzyme'
import {Provider} from 'react-redux'
import {createMockStore} from '../../shared/test-utils'
import FeedListPageContainer from './FeedListPageContainer'

describe('FeedListPageContainer', () => {

  let store

  const createContainer = () => {
    const wrapper = mount(
      <Provider store={store}>
        <FeedListPageContainer />
      </Provider>
    )
    return wrapper.find(FeedListPageContainer).children().first()
  }

  beforeEach(() => {
    store = createMockStore()
    store.setState({
      router: {
        query: {
          q: 'title2'
        }
      },
      admin: {
        feeds: [
          {uuid: '1', title: 'title1', hasErrors: false, createdAt: '2017-12-29'},
          {uuid: '2', title: 'title2', hasErrors: true, createdAt: '2017-11-30'}
        ]
      }
    })
  })

  it('should initialize component with given props', () => {
    expect(createContainer().props()).toContainObject({
      feeds: [{uuid: '2', title: 'title2', hasErrors: true, createdAt: '2017-11-30'}],
      router: {
        query: {
          q: 'title2'
        }
      }
    })
  })

  it('should dispatch action when prop function "onSearchChange" triggered', () => {
    createContainer().props().onSearchChange({q: 'b'})

    expect(store.getActions()[0]).toContainObject({
      type: 'ROUTE_CHANGED',
      route: ['admin', 'feed'],
      query: {q: 'b'}
    })
  })

  it('should dispatch action when prop function "onRefresh" triggered', () => {
    createContainer().props().onRefresh()

    expect(store.getActionTypes()).toContainObject(['GET_FEEDS'])
  })
})
