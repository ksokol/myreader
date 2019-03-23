import React from 'react'
import {mount} from 'enzyme'
import {Provider} from 'react-redux'
import {createMockStore} from '../../shared/test-utils'
import SubscriptionListPageContainer from './SubscriptionListPageContainer'

describe('SubscriptionListPageContainer', () => {

  let store

  const createContainer = () => {
    const wrapper = mount(
      <Provider store={store}>
        <SubscriptionListPageContainer />
      </Provider>
    )
    return wrapper.find(SubscriptionListPageContainer).children().first()
  }

  beforeEach(() => {
    store = createMockStore()
    store.setState({
      subscription: {
        subscriptions: [
          {uuid: '1', title: 'title1', createdAt: '2017-12-29'},
          {uuid: '2', title: 'title2', createdAt: '2017-11-30'}
        ]
      }
    })
  })

  it('should initialize component with given props', () => {
    expect(createContainer().props()).toContainObject({
      subscriptions: [{uuid: '2', title: 'title2', createdAt: '2017-11-30'}]
    })
  })

  it('should dispatch action when prop function "onSearchChange" triggered', () => {
    createContainer().props().onSearchChange({q: 'b'})

    expect(store.getActions()[0]).toContainObject({
      type: 'ROUTE_CHANGED',
      route: ['app', 'subscriptions'],
      query: {q: 'b'}
    })
  })

  it('should dispatch action when prop function "onRefresh" triggered', () => {
    createContainer().props().onRefresh()

    expect(store.getActionTypes()).toContainObject(['GET_SUBSCRIPTIONS'])
  })
})
