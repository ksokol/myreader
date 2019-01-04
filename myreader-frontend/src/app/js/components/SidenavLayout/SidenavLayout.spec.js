import React from 'react'
import {shallow} from 'enzyme'
import SidenavLayout from './SidenavLayout'

describe('SidenavLayout', () => {

  let props

  const createComponent = () => shallow(<SidenavLayout {...props} />)

  beforeEach(() => {
    props = {
      isDesktop: false,
      sidenavSlideIn: true,
      toggleSidenav: jest.fn()
    }
  })

  it('should not slide in navigation on desktop', () => {
    props.isDesktop = false
    expect(createComponent().find('.my-sidenav-layout__nav--animate').exists()).toEqual(true)

    props.isDesktop = true
    expect(createComponent().find('.my-sidenav-layout__nav--animate').exists()).toEqual(false)
  })

  it('should toggle navigation when state changes', () => {
    props.sidenavSlideIn = true
    expect(createComponent().find('.my-sidenav-layout__nav--open').exists()).toEqual(true)

    props.sidenavSlideIn = false
    expect(createComponent().find('.my-sidenav-layout__nav--open').exists()).toEqual(false)
  })

  it('should show hamburger menu on phones and tablets', () => {
    props.isDesktop = false
    expect(createComponent().find('[type="bars"]').exists()).toEqual(true)

    props.isDesktop = true
    expect(createComponent().find('[type="bars"]').exists()).toEqual(false)
  })

  it('should toggle navigation when hamburger menu icon clicked', () => {
    createComponent().find('[type="bars"]').simulate('click')

    expect(props.toggleSidenav).toHaveBeenCalled()
  })
})
