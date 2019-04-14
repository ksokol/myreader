import React from 'react'
import {mount} from 'enzyme'
import SidenavLayout from './SidenavLayout'

/* eslint-disable react/prop-types */
jest.mock('../../containers', () => ({
  BackdropContainer: () => null,
  NavigationContainer: () => null,
}))
/* eslint-enable */

describe('SidenavLayout', () => {

  let state, dispatch

  const createComponent = () => mount(<SidenavLayout state={state} dispatch={dispatch} />)

  beforeEach(() => {
    dispatch = jest.fn()

    state = {
      common: {
        mediaBreakpoint: 'phone',
        sidenavSlideIn: true,
        backdropVisible: true
      }
    }
  })

  it('should not slide in navigation on desktop', () => {
    expect(createComponent().find('.my-sidenav-layout__nav--animate').exists()).toEqual(true)

    state.common.mediaBreakpoint = 'desktop'
    expect(createComponent().find('.my-sidenav-layout__nav--animate').exists()).toEqual(false)
  })

  it('should toggle navigation when state changes', () => {
    state.common.sidenavSlideIn = true
    expect(createComponent().find('.my-sidenav-layout__nav--open').exists()).toEqual(true)

    state.common.sidenavSlideIn = false
    expect(createComponent().find('.my-sidenav-layout__nav--open').exists()).toEqual(false)
  })

  it('should show hamburger menu on phones and tablets', () => {
    expect(createComponent().find('IconButton[type="bars"]').exists()).toEqual(true)

    state.common.mediaBreakpoint = 'desktop'
    expect(createComponent().find('IconButton[type="bars"]').exists()).toEqual(false)
  })

  it('should dispatch action TOGGLE_SIDENAV when hamburger menu icon clicked', () => {
    createComponent().find('IconButton[type="bars"]').simulate('click')

    expect(dispatch).toHaveBeenCalledWith({
      type: 'TOGGLE_SIDENAV'
    })
  })
})
