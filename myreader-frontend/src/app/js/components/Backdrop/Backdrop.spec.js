import React from 'react'
import {mount} from 'enzyme'
import Backdrop from './Backdrop'
import {tick} from '../../shared/test-utils'

describe('Backdrop', () => {

  let props

  const createComponent = () => mount(<Backdrop {...props} />)

  beforeEach(() => {
    props = {
      isBackdropVisible: false,
      onClick: jest.fn()
    }
  })

  it('should not mount backdrop after initialization', () => {
    expect(createComponent().state().isMounted).toEqual(false)
  })

  it('should mount backdrop when state changes to true', () => {
    const wrapper = createComponent()
    wrapper.setProps({isBackdropVisible: true})

    expect(wrapper.state().isMounted).toEqual(true)
  })

  it('should not unmount backdrop instantly when state changes from true to false', () => {
    const wrapper = createComponent()
    wrapper.setProps({isBackdropVisible: true})
    wrapper.setProps({isBackdropVisible: false})

    expect(wrapper.state().isMounted).toEqual(true)
  })

  it('should show backdrop when state is true', () => {
    const wrapper = createComponent()
    wrapper.setProps({isBackdropVisible: true})

    expect(wrapper.state().isVisible).toBe(true)
    expect(wrapper.state().isClosing).toEqual(false)
  })

  it('should mark backdrop as closing when state changes to false', () => {
    const wrapper = createComponent()
    wrapper.setProps({isBackdropVisible: true})
    wrapper.setProps({isBackdropVisible: false})

    expect(wrapper.state().isVisible).toEqual(false)
    expect(wrapper.state().isClosing).toEqual(true)
  })

  it('should unmount backdrop when 300ms passed', () => {
    const wrapper = createComponent()
    wrapper.setProps({isBackdropVisible: true})
    wrapper.setProps({isBackdropVisible: false})

    tick(299)
    expect(wrapper.state().isMounted).toEqual(true)

    tick(1)
    expect(wrapper.state().isMounted).toEqual(false)
  })

  it('should not unmount backdrop when state changed to true within 300ms', () => {
    const wrapper = createComponent()
    wrapper.setProps({isBackdropVisible: true})
    wrapper.setProps({isBackdropVisible: false})
    tick(299)

    wrapper.setProps({isBackdropVisible: true})
    tick(1)

    expect(wrapper.state().isMounted).toEqual(true)
  })

  it('should not hide backdrop when state changed to true within 300ms', () => {
    const wrapper = createComponent()
    wrapper.setProps({isBackdropVisible: true})
    wrapper.setProps({isBackdropVisible: false})
    tick(299)

    wrapper.setProps({isBackdropVisible: true})
    tick(1)

    expect(wrapper.state().isVisible).toEqual(true)
    expect(wrapper.state().isClosing).toEqual(false)
  })

  it('should show backdrop when state changed to true again', () => {
    const wrapper = createComponent()
    wrapper.setProps({isBackdropVisible: true})
    wrapper.setProps({isBackdropVisible: false})

    tick(300)

    wrapper.setProps({isBackdropVisible: true})

    expect(wrapper.state().isMounted).toEqual(true)
    expect(wrapper.state().isVisible).toEqual(true)
    expect(wrapper.state().isClosing).toEqual(false)
  })

  it('should hide backdrop when click occurred on backdrop', () => {
    const wrapper = createComponent()
    wrapper.setProps({isBackdropVisible: true})
    wrapper.props().onClick()

    expect(props.onClick).toHaveBeenCalled()
  })
})
