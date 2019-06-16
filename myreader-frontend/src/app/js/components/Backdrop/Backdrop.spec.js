import React from 'react'
import {mount} from 'enzyme'
import {Backdrop} from './Backdrop'

const backdropClass = '.my-backdrop'

describe('Backdrop', () => {

  let state, dispatch

  const createWrapper = () => mount(<Backdrop state={state} dispatch={dispatch} />)

  beforeEach(() => {
    dispatch = jest.fn()

    state = {
      common: {
        backdropVisible: false
      }
    }
  })

  it('should not show backdrop when mounted', () => {
    expect(createWrapper().find(backdropClass).exists()).toEqual(false)
  })

  it('should show backdrop when state backdropVisible changes to true', () => {
    const wrapper = createWrapper()
    state.common.backdropVisible = true
    wrapper.setProps()
    wrapper.update()

    expect(wrapper.find(backdropClass).exists()).toEqual(true)
  })

  it('should not show backdrop instantly when state backdropVisible changes from true to false', () => {
    const wrapper = createWrapper()
    state.common.backdropVisible = true
    wrapper.setProps()
    wrapper.update()

    state.common.backdropVisible = false
    wrapper.setProps()
    wrapper.update()

    expect(wrapper.find(backdropClass).exists()).toEqual(true)
  })

  it('should hide backdrop when 300ms passed', () => {
    const wrapper = createWrapper()
    state.common.backdropVisible = true
    wrapper.setProps()
    wrapper.update()

    state.common.backdropVisible = false
    wrapper.setProps()
    wrapper.update()

    jest.advanceTimersByTime(299)
    wrapper.update()
    expect(wrapper.find(backdropClass).exists()).toEqual(true)

    jest.advanceTimersByTime(1)
    wrapper.update()
    expect(wrapper.find(backdropClass).exists()).toEqual(false)
  })

  it('should not show backdrop when state backdropVisible changes to true within 300ms', () => {
    const wrapper = createWrapper()
    state.common.backdropVisible = true
    wrapper.setProps()
    wrapper.update()

    state.common.backdropVisible = false
    wrapper.setProps()
    wrapper.update()

    jest.advanceTimersByTime(299)
    wrapper.update()

    state.common.backdropVisible = true
    wrapper.setProps()
    wrapper.update()

    jest.advanceTimersByTime(1)
    wrapper.update()

    expect(wrapper.find(backdropClass).exists()).toEqual(true)
  })

  it('should show backdrop when state backdropVisible changes to true again', () => {
    const wrapper = createWrapper()
    state.common.backdropVisible = true
    wrapper.setProps()
    wrapper.update()

    state.common.backdropVisible = false
    wrapper.setProps()
    wrapper.update()

    jest.advanceTimersByTime(300)
    wrapper.update()

    state.common.backdropVisible = true
    wrapper.setProps()
    wrapper.update()

    expect(wrapper.find(backdropClass).exists()).toEqual(true)
  })

  it('should append visible class when backdrop is visible', () => {
    const wrapper = createWrapper()
    state.common.backdropVisible = true
    wrapper.setProps()
    wrapper.update()

    expect(wrapper.find(backdropClass).prop('className')).toContain('my-backdrop--visible')
  })

  it('should append visible closing when backdrop is about to be hidden', () => {
    const wrapper = createWrapper()
    state.common.backdropVisible = true
    wrapper.setProps()
    wrapper.update()

    state.common.backdropVisible = false
    wrapper.setProps()
    wrapper.update()

    expect(wrapper.find(backdropClass).prop('className')).toContain('my-backdrop--closing')
  })

  it('should dispatch action HIDE_BACKDROP when prop function "onClick" triggered', () => {
    const wrapper = createWrapper()
    state.common.backdropVisible = true
    wrapper.setProps()
    wrapper.update()

    wrapper.find(backdropClass).props().onClick()

    expect(dispatch).toHaveBeenCalledWith({
      type: 'HIDE_BACKDROP'
    })
  })
})
