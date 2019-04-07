import React from 'react'
import {mount} from 'enzyme'
import NavigationContainer from './NavigationContainer'

/* eslint-disable react/prop-types */
jest.mock('../../components', () => ({
  Navigation: () => null
}))
/* eslint-enable */

describe('NavigationContainer', () => {

  let state, dispatch

  const createWrapper = () => {
    return mount(<NavigationContainer dispatch={dispatch} {...state} />).find('Navigation')
  }

  beforeEach(() => {
    dispatch = jest.fn()

    state = {
      subscription: {subscriptions: [{uuid: '1'}, {uuid: '2'}]},
      settings: {showUnseenEntries: false},
      security: {roles: ['ADMIN']}
    }
  })

  it('should initialize navigation component with given props', () => {
    expect(createWrapper().props()).toContainObject({
      isAdmin: true,
      subscriptions: [{uuid: '1'}, {uuid: '2'}]
    })
  })

  it('should dispatch actions TOGGLE_SIDENAV when prop function "onClick" triggered', () => {
    const wrapper = createWrapper()
    wrapper.props().onClick()

    expect(dispatch).toHaveBeenCalledWith({
      type: 'TOGGLE_SIDENAV'
    })
  })
})
