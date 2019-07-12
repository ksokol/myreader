import React from 'react'
import {mount} from 'enzyme'
import {SidenavLayout} from './SidenavLayout'

/* eslint-disable react/prop-types */
jest.mock('../Backdrop/Backdrop', () => ({
  Backdrop: () => null
}))

jest.mock('../Navigation/Navigation', () => props => <div className='navigation' {...props} />)

jest.mock('../../contexts/locationState/withLocationState', () => ({
  withLocationState: Component => Component
}))

jest.mock('../../contexts', () => ({
  withAppContext: Component => Component
}))
/* eslint-enable */

const hamburgerMenu = 'IconButton[type="bars"]'
const navigation = '.navigation'
const openNavigation = '.my-sidenav-layout__nav--open'

describe('SidenavLayout', () => {

  let props

  const createWrapper = () => mount(<SidenavLayout {...props} />)

  beforeEach(() => {
    props = {
      mediaBreakpoint: 'phone',
      locationReload: false
    }
  })

  it('should animate navigation when not on desktop', () => {
    expect(createWrapper().find('.my-sidenav-layout__nav--animate').exists()).toEqual(true)

    props.mediaBreakpoint = 'desktop'
    expect(createWrapper().find('.my-sidenav-layout__nav--animate').exists()).toEqual(false)
  })

  it('should toggle navigation when hamburger menu and navigation clicked', () => {
    const wrapper = createWrapper()
    wrapper.find(hamburgerMenu).invoke('onClick')()
    expect(wrapper.find(openNavigation).exists()).toEqual(true)

    wrapper.find(navigation).invoke('onClick')()
    expect(wrapper.find(openNavigation).exists()).toEqual(false)
  })

  it('should show hamburger menu on phones and tablets', () => {
    expect(createWrapper().find(hamburgerMenu).exists()).toEqual(true)

    props.mediaBreakpoint = 'desktop'
    expect(createWrapper().find(hamburgerMenu).exists()).toEqual(false)
  })

  it('should toggle navigation when hamburger menu and backdrop clicked', () => {
    const wrapper = createWrapper()
    wrapper.find(hamburgerMenu).invoke('onClick')()
    expect(wrapper.find(openNavigation).exists()).toEqual(true)

    wrapper.find('Backdrop').invoke('onClick')()
    expect(wrapper.find(openNavigation).exists()).toEqual(false)
  })

  it('should set prop "maybeVisible" to true on backdrop component when hamburger menu clicked', () => {
    const wrapper = createWrapper()
    wrapper.find(hamburgerMenu).invoke('onClick')()

    expect(wrapper.find('Backdrop').prop('maybeVisible')).toEqual(true)
  })

  it('should set prop "maybeVisible" to false on backdrop component when backdrop clicked', () => {
    const wrapper = createWrapper()
    wrapper.find(hamburgerMenu).invoke('onClick')()
    wrapper.find('Backdrop').invoke('onClick')()

    expect(wrapper.find('Backdrop').prop('maybeVisible')).toEqual(false)
  })

  it('should set prop "maybeVisible" to false on backdrop component when navigation clicked', () => {
    const wrapper = createWrapper()
    wrapper.find(hamburgerMenu).invoke('onClick')()
    wrapper.find(navigation).invoke('onClick')()

    expect(wrapper.find('Backdrop').prop('maybeVisible')).toEqual(false)
  })

  it('should not slide in navigation on desktop', () => {
    const wrapper = createWrapper()

    expect(wrapper.find('Backdrop').prop('maybeVisible')).toEqual(false)
    expect(wrapper.find(openNavigation).exists()).toEqual(false)

    wrapper.setProps({mediaBreakpoint: 'desktop'})

    expect(wrapper.find('Backdrop').prop('maybeVisible')).toEqual(false)
    expect(wrapper.find(openNavigation).exists()).toEqual(false)
  })

  it('should pin navigation when on desktop', () => {
    const wrapper = createWrapper()
    wrapper.find(hamburgerMenu).invoke('onClick')()

    expect(wrapper.find('Backdrop').prop('maybeVisible')).toEqual(true)
    expect(wrapper.find(openNavigation).exists()).toEqual(true)

    wrapper.setProps({mediaBreakpoint: 'desktop'})
    wrapper.update()

    expect(wrapper.find('Backdrop').prop('maybeVisible')).toEqual(false)
    expect(wrapper.find(openNavigation).exists()).toEqual(false)
  })

  it('should slide in navigation when not on desktop', () => {
    const wrapper = createWrapper()
    wrapper.setProps({mediaBreakpoint: 'desktop'})

    expect(wrapper.find('Backdrop').prop('maybeVisible')).toEqual(false)
    expect(wrapper.find(openNavigation).exists()).toEqual(false)

    wrapper.setProps({mediaBreakpoint: 'phone'})
    wrapper.update()
    wrapper.find(hamburgerMenu).invoke('onClick')()
    wrapper.update()

    expect(wrapper.find('Backdrop').prop('maybeVisible')).toEqual(true)
    expect(wrapper.find(openNavigation).exists()).toEqual(true)
  })
})
