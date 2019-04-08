import React from 'react'
import {mount} from 'enzyme'
import SidenavLayoutContainer from './SidenavLayoutContainer'

/* eslint-disable react/prop-types */
jest.mock('../../components', () => ({
  SidenavLayout: () => null
}))
/* eslint-enable */

describe('SidenavLayoutContainer', () => {

  let state, dispatch

  const createWrapper = () => {
    return mount(<SidenavLayoutContainer dispatch={dispatch} state={state} />).find('SidenavLayout')
  }

  beforeEach(() => {
    dispatch = jest.fn()

    state = {
      common: {
        mediaBreakpoint: 'desktop',
        sidenavSlideIn: true,
        backdropVisible: true
      }
    }
  })

  it('should initialize component with given props', () => {
    expect(createWrapper().props()).toContainObject({
      isDesktop: true,
      sidenavSlideIn: true
    })
  })

  it('should dispatch expected action when prop function "toggleSidenav" triggered', () => {
    createWrapper().props().toggleSidenav()

    expect(dispatch).toHaveBeenCalledWith({
      type: 'TOGGLE_SIDENAV'
    })
  })
})
