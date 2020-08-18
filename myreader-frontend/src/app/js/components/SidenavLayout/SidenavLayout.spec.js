import React from 'react'
import {mount} from 'enzyme'
import {SidenavLayout} from './SidenavLayout'
import {useMediaBreakpoint} from '../../contexts/mediaBreakpoint'

/* eslint-disable react/prop-types */
jest.mock('../Backdrop/Backdrop', () => ({
  Backdrop: () => null
}))

jest.mock('../Navigation/Navigation', () => props => <div className='navigation' {...props} />)

jest.mock('../../contexts/locationState/withLocationState', () => ({
  withLocationState: Component => Component
}))

jest.mock('../../contexts/mediaBreakpoint', () => ({
  useMediaBreakpoint: jest.fn()
}))
/* eslint-enable */

const hamburgerMenu = 'IconButton[type="bars"]'
const navigation = '.navigation'
const openNavigation = '.my-sidenav-layout__nav--open'

describe('SidenavLayout', () => {

  let props, wrapper

  const createWrapper = () => mount(<SidenavLayout {...props} />)

  beforeEach(() => {
    useMediaBreakpoint.mockReturnValue({
      mediaBreakpoint: 'phone',
      isDesktop: false,
    })

    props = {
      fetchSubscriptions: jest.fn()
    }

    wrapper = createWrapper()
  })

  it('should animate navigation when not on desktop', () => {
    expect(wrapper.find('.my-sidenav-layout__nav--animate').exists()).toEqual(true)

    useMediaBreakpoint.mockReturnValueOnce({
      mediaBreakpoint: 'desktop',
      isDesktop: true
    })
    wrapper.mount()

    expect(wrapper.find('.my-sidenav-layout__nav--animate').exists()).toEqual(false)
  })

  it('should toggle navigation when hamburger menu and navigation clicked', () => {
    wrapper.find(hamburgerMenu).invoke('onClick')()
    expect(wrapper.find(openNavigation).exists()).toEqual(true)

    wrapper.find(navigation).invoke('onClick')()
    expect(wrapper.find(openNavigation).exists()).toEqual(false)
  })

  it('should not show hamburger menu on phones and tablets', () => {
    expect(wrapper.find(hamburgerMenu).exists()).toEqual(true)

    useMediaBreakpoint.mockReturnValueOnce({
      mediaBreakpoint: 'desktop',
      isDesktop: true
    })
    wrapper.mount()

    expect(wrapper.find(hamburgerMenu).exists()).toEqual(false)
  })

  it('should toggle navigation when hamburger menu and backdrop clicked', () => {
    wrapper.find(hamburgerMenu).invoke('onClick')()
    expect(wrapper.find(openNavigation).exists()).toEqual(true)

    wrapper.find('Backdrop').invoke('onClick')()
    expect(wrapper.find(openNavigation).exists()).toEqual(false)
  })

  it('should set prop "maybeVisible" to true on backdrop component when hamburger menu clicked', () => {
    wrapper.find(hamburgerMenu).invoke('onClick')()

    expect(wrapper.find('Backdrop').prop('maybeVisible')).toEqual(true)
  })

  it('should set prop "maybeVisible" to false on backdrop component when backdrop clicked', () => {
    wrapper.find(hamburgerMenu).invoke('onClick')()
    wrapper.find('Backdrop').invoke('onClick')()

    expect(wrapper.find('Backdrop').prop('maybeVisible')).toEqual(false)
  })

  it('should set prop "maybeVisible" to false on backdrop component when navigation clicked', () => {
    wrapper.find(hamburgerMenu).invoke('onClick')()
    wrapper.find(navigation).invoke('onClick')()

    expect(wrapper.find('Backdrop').prop('maybeVisible')).toEqual(false)
  })

  it('should not slide in navigation on desktop', () => {
    expect(wrapper.find('Backdrop').prop('maybeVisible')).toEqual(false)
    expect(wrapper.find(openNavigation).exists()).toEqual(false)

    useMediaBreakpoint.mockReturnValueOnce({
      mediaBreakpoint: 'desktop',
      isDesktop: true
    })
    wrapper.mount()

    expect(wrapper.find('Backdrop').prop('maybeVisible')).toEqual(false)
    expect(wrapper.find(openNavigation).exists()).toEqual(false)
  })

  it('should pin navigation when on desktop', () => {
    wrapper.find(hamburgerMenu).invoke('onClick')()

    expect(wrapper.find('Backdrop').prop('maybeVisible')).toEqual(true)
    expect(wrapper.find(openNavigation).exists()).toEqual(true)

    useMediaBreakpoint.mockReturnValueOnce({
      mediaBreakpoint: 'desktop',
      isDesktop: true
    })
    wrapper.mount()
    wrapper.update()

    expect(wrapper.find('Backdrop').prop('maybeVisible')).toEqual(false)
    expect(wrapper.find(openNavigation).exists()).toEqual(false)
  })

  it('should slide in navigation when not on desktop', () => {
    useMediaBreakpoint.mockReturnValueOnce({
      mediaBreakpoint: 'desktop',
      isDesktop: true
    })
    wrapper.mount()

    expect(wrapper.find('Backdrop').prop('maybeVisible')).toEqual(false)
    expect(wrapper.find(openNavigation).exists()).toEqual(false)

    useMediaBreakpoint.mockReturnValueOnce({
      mediaBreakpoint: 'phone',
      isDesktop: false
    })
    wrapper.mount()

    wrapper.find(hamburgerMenu).invoke('onClick')()
    wrapper.update()

    expect(wrapper.find('Backdrop').prop('maybeVisible')).toEqual(true)
    expect(wrapper.find(openNavigation).exists()).toEqual(true)
  })

  it('should not show backdrop when navigation clicked and media breakpoint is set to desktop', () => {
    useMediaBreakpoint.mockReturnValue({
      mediaBreakpoint: 'desktop',
      isDesktop: true
    })
    wrapper.mount()

    wrapper.find(navigation).invoke('onClick')()
    expect(wrapper.find('Backdrop').prop('maybeVisible')).toEqual(false)
  })
})
