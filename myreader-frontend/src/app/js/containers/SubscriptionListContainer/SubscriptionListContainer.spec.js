import React from 'react'
import {mount} from 'enzyme'
import {Provider} from 'react-redux'
import {SubscriptionList} from '../../components'
import {createMockStore} from '../../shared/test-utils'
import SubscriptionListContainer from './SubscriptionListContainer'

describe('SubscriptionListContainer', () => {

  let store

  const createContainer = () => {
    const wrapper = mount(
      <Provider store={store}>
        <SubscriptionListContainer />
      </Provider>
    )
    return wrapper.find(SubscriptionList)
  }

  beforeEach(() => {
    store = createMockStore()
    store.setState({
      router: {
        query: {
          q: 'title2'
        }
      },
      subscription: {
        subscriptions: [
          {uuid: '1', title: 'title1', createdAt: '2017-12-29'},
          {uuid: '2', title: 'title2', createdAt: '2017-11-30'}
        ]
      }
    })
  })

  it('should initialize component with given props', () => {
    expect(createContainer().prop('subscriptions')).toEqual([
      {uuid: '2', title: 'title2', createdAt: '2017-11-30'}
    ])
  })

  it('should dispatch action when prop function "navigateTo" triggered', () => {
    createContainer().props().navigateTo({uuid: '2', title: '2', createdAt: '2'})

    expect(store.getActions()[0]).toContainObject({
      type: 'ROUTE_CHANGED',
      route: ['app', 'subscription'],
      query: {uuid: '2'}
    })
  })
})
