import React from 'react'
import {mount} from 'enzyme'
import SidenavLayout from './SidenavLayout'

/* eslint-disable react/prop-types */
jest.mock('../../containers', () => ({
  BackdropContainer: () => null
}))

jest.mock('../Navigation/Navigation', () => () => null)

jest.mock('../../contexts', () => ({
  withLocationState: Component => Component
}))
/* eslint-enable */

describe('SidenavLayout', () => {

  let props, state, dispatch

  const createWrapper = () => mount(<SidenavLayout {...props} state={state} dispatch={dispatch} />)

  beforeEach(() => {
    dispatch = jest.fn()

    props = {
      locationReload: false
    }

    state = {
      common: {
        mediaBreakpoint: 'phone',
        sidenavSlideIn: true,
        backdropVisible: true
      }
    }
  })

  it('should not slide in navigation on desktop', () => {
    expect(createWrapper().find('.my-sidenav-layout__nav--animate').exists()).toEqual(true)

    state.common.mediaBreakpoint = 'desktop'
    expect(createWrapper().find('.my-sidenav-layout__nav--animate').exists()).toEqual(false)
  })

  it('should toggle navigation when state changes', () => {
    state.common.sidenavSlideIn = true
    expect(createWrapper().find('.my-sidenav-layout__nav--open').exists()).toEqual(true)

    state.common.sidenavSlideIn = false
    expect(createWrapper().find('.my-sidenav-layout__nav--open').exists()).toEqual(false)
  })

  it('should show hamburger menu on phones and tablets', () => {
    expect(createWrapper().find('IconButton[type="bars"]').exists()).toEqual(true)

    state.common.mediaBreakpoint = 'desktop'
    expect(createWrapper().find('IconButton[type="bars"]').exists()).toEqual(false)
  })

  it('should dispatch action TOGGLE_SIDENAV when hamburger menu icon clicked', () => {
    createWrapper().find('IconButton[type="bars"]').simulate('click')

    expect(dispatch).toHaveBeenCalledWith({
      type: 'TOGGLE_SIDENAV'
    })
  })

  it('should dispatch action GET_SUBSCRIPTIONS when mounted', () => {
    createWrapper()

    expect(dispatch).toHaveBeenNthCalledWith(1, expect.objectContaining({
      type: 'GET_SUBSCRIPTIONS',
      url: 'api/2/subscriptions'
    }))
  })

  it('should dispatch action GET_SUBSCRIPTIONS when prop "locationReload" is set to true', () => {
    const wrapper = createWrapper()
    dispatch.mockClear()

    wrapper.setProps({locationReload: true})

    expect(dispatch).toHaveBeenNthCalledWith(1, expect.objectContaining({
      type: 'GET_SUBSCRIPTIONS',
      url: 'api/2/subscriptions'
    }))
  })

  it('should not dispatch action GET_SUBSCRIPTIONS when prop "locationReload" is set to false', () => {
    const wrapper = createWrapper()
    dispatch.mockClear()

    wrapper.setProps({locationReload: false})

    expect(dispatch).not.toHaveBeenCalled()
  })
})
