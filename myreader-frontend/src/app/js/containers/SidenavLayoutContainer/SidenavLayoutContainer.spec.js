import React from 'react'
import {mount} from 'enzyme'
import {Provider} from 'react-redux'
import SidenavLayoutContainer from './SidenavLayoutContainer'
import {createMockStore} from '../../shared/test-utils'

describe('SidenavLayoutContainer', () => {

  let store

  const createContainer = () => {
    const wrapper = mount(
      <Provider store={store}>
        <SidenavLayoutContainer />
      </Provider>
    )
    return wrapper.find(SidenavLayoutContainer).children().first()
  }

  beforeEach(() => {
    store = createMockStore()
    store.setState({
      common: {
        mediaBreakpoint: 'desktop',
        sidenavSlideIn: true,
        backdropVisible: true
      }
    })
  })

  it('should initialize component with given props', () => {
    expect(createContainer().props()).toContainObject({
      isDesktop: true,
      sidenavSlideIn: true
    })
  })

  it('should dispatch expected action when prop function "toggleSidenav" triggered', () => {
    createContainer().props().toggleSidenav()

    expect(store.getActionTypes()).toEqual(['TOGGLE_SIDENAV'])
  })
})
