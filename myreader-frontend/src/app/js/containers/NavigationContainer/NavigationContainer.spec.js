import React from 'react'
import {Provider} from 'react-redux'
import {mount} from 'enzyme'
import {createMockStore} from '../../shared/test-utils'
import NavigationContainer from './NavigationContainer'
import {Navigation} from '../../components'

describe('NavigationContainer', () => {

  let store

  const createContainer = () => {
    const wrapper = mount(
      <Provider store={store}>
        <NavigationContainer />
      </Provider>
    )

    return wrapper.find(Navigation)
  }

  beforeEach(() => {
    store = createMockStore()
    store.setState({
      subscription: {subscriptions: [{uuid: '1'}, {uuid: '2'}]},
      router: {query: {a: 'b'}},
      settings: {showUnseenEntries: false},
      security: {role: 'ROLE_ADMIN'}
    })
  })

  it('should initialize navigation component with given props', () => {
    expect(createContainer().props()).toContainObject({
      isAdmin: true,
      subscriptions: [{uuid: '1'}, {uuid: '2'}],
      router: {query: {a: 'b'}}
    })
  })

  it('should dispatch actions TOGGLE_SIDENAV and ROUTE_CHANGED with route when prop function "routeTo" triggered', () => {
    const wrapper = createContainer()
    wrapper.props().routeTo({route: ['expected'], query: {a: 'b'}})

    expect(store.getActions()[0]).toContainObject({
      type: 'TOGGLE_SIDENAV'
    })
    expect(store.getActions()[1]).toContainObject({
      type: 'ROUTE_CHANGED',
      route: ['expected'],
      query: {a: 'b'}
    })
  })
})
