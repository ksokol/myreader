import React from 'react'
import {mount} from 'enzyme'
import {Backdrop} from './Backdrop'

const backdropClass = '.my-backdrop'

describe('Backdrop', () => {

  let props

  const createWrapper = () => mount(<Backdrop {...props} />)

  beforeEach(() => {
    props = {
      maybeVisible: false,
      onClick: jest.fn()
    }
  })

  it('should not show backdrop when mounted', () => {
    expect(createWrapper().find(backdropClass).exists()).toEqual(false)
  })

  it('should show backdrop when prop "maybeVisible" changes to true', () => {
    const wrapper = createWrapper()
    wrapper.setProps({maybeVisible: true})
    wrapper.update()

    expect(wrapper.find(backdropClass).exists()).toEqual(true)
  })

  it('should not show backdrop instantly when prop "maybeVisible" changes from true to false', () => {
    const wrapper = createWrapper()
    wrapper.setProps({maybeVisible: true})
    wrapper.update()

    wrapper.setProps({maybeVisible: false})
    wrapper.update()

    expect(wrapper.find(backdropClass).exists()).toEqual(true)
  })

  it('should hide backdrop when 300ms passed', () => {
    const wrapper = createWrapper()
    wrapper.setProps({maybeVisible: true})
    wrapper.update()

    wrapper.setProps({maybeVisible: false})
    wrapper.update()

    jest.advanceTimersByTime(299)
    wrapper.update()
    expect(wrapper.find(backdropClass).exists()).toEqual(true)

    jest.advanceTimersByTime(1)
    wrapper.update()
    expect(wrapper.find(backdropClass).exists()).toEqual(false)
  })

  it('should not show backdrop when prop "maybeVisible" changes to true within 300ms', () => {
    const wrapper = createWrapper()
    wrapper.setProps({maybeVisible: true})
    wrapper.update()

    wrapper.setProps({maybeVisible: false})
    wrapper.update()

    jest.advanceTimersByTime(299)
    wrapper.update()

    wrapper.setProps({maybeVisible: true})
    wrapper.update()

    jest.advanceTimersByTime(1)
    wrapper.update()

    expect(wrapper.find(backdropClass).exists()).toEqual(true)
  })

  it('should show backdrop when prop "maybeVisible" changes to true again', () => {
    const wrapper = createWrapper()
    wrapper.setProps({maybeVisible: true})
    wrapper.update()

    wrapper.setProps({maybeVisible: false})
    wrapper.update()

    jest.advanceTimersByTime(300)
    wrapper.update()

    wrapper.setProps({maybeVisible: true})
    wrapper.update()

    expect(wrapper.find(backdropClass).exists()).toEqual(true)
  })

  it('should append visible class when backdrop is visible', () => {
    const wrapper = createWrapper()
    wrapper.setProps({maybeVisible: true})
    wrapper.update()

    expect(wrapper.find(backdropClass).prop('className')).toContain('my-backdrop--visible')
  })

  it('should append visible closing when backdrop is about to be hidden', () => {
    const wrapper = createWrapper()
    wrapper.setProps({maybeVisible: true})
    wrapper.update()

    wrapper.setProps({maybeVisible: false})
    wrapper.update()

    expect(wrapper.find(backdropClass).prop('className')).toContain('my-backdrop--closing')
  })

  it('should trigger prop function "onClick" when click on backdrop occurred', () => {
    const wrapper = createWrapper()
    wrapper.setProps({maybeVisible: true})
    wrapper.update()
    wrapper.find(backdropClass).props().onClick()

    expect(props.onClick).toHaveBeenCalled()
  })
})
