import React from 'react'
import {shallow} from 'enzyme'
import {Chip} from './Chip'
import {IconButton} from '..'

describe('Chip', () => {

  let props

  beforeEach(() => {
    props = {
      keyFn: () => 'test',
      value: 'test'
    }
  })

  const createShallow = () => shallow(<Chip {...props}>expected child</Chip>)

  it('should not mark as selected', () => {
    expect(createShallow().hasClass('my-chip my-chip--selected')).not.toEqual(true)
  })

  it('should mark as selected', () => {
    const wrapper = createShallow()
    wrapper.setProps({selected: 'test'})

    expect(wrapper.hasClass('my-chip my-chip--selected')).toEqual(true)
  })

  it('should not mark as selectable when prop "selected" equals prop "keyFn" function return value but prop "onSelect" function is undefined', () => {
    const wrapper = createShallow()
    wrapper.setProps({selected: 'test'})

    expect(wrapper.hasClass('my-chip my-chip--selectable')).not.toEqual(true)
  })

  it('should not mark as selectable when already selected', () => {
    const wrapper = createShallow()
    wrapper.setProps({
      selected: 'test',
      onSelect: () => {}
    })

    expect(wrapper.hasClass('my-chip my-chip--selectable')).not.toEqual(true)
  })

  it('should mark as selectable when not selected and prop "onSelect" function is defined', () => {
    const wrapper = createShallow()
    wrapper.setProps({onSelect: () => {}})

    expect(wrapper.hasClass('my-chip my-chip--selectable')).toEqual(true)
  })

  it('should not mark as selectable when prop "disabled" is true', () => {
    const wrapper = createShallow()
    wrapper.setProps({
      disabled: true,
      onSelect: () => {}
    })

    expect(wrapper.hasClass('my-chip my-chip--disabled')).toEqual(true)
  })

  it('should mark as selectable when prop "keyFn" function returns "other"', () => {
    const wrapper = createShallow()
    wrapper.setProps({
      keyFn: () => 'other',
      onSelect: () => {}
    })

    expect(wrapper.hasClass('my-chip my-chip--selectable')).toEqual(true)
  })

  it('should trigger prop "onSelect" function on click', () => {
    const wrapper = createShallow()
    props.onSelect = jest.fn()
    wrapper.setProps(props)

    wrapper.children().props().onClick()
    expect(props.onSelect).toHaveBeenCalled()
  })

  it('should not trigger prop "onSelect" function on click when prop "disabled" is true', () => {
    const wrapper = createShallow()
    props.onSelect = jest.fn()
    props.disabled = true
    wrapper.setProps(props)

    wrapper.children().props().onClick()
    expect(props.onSelect).not.toHaveBeenCalled()
  })

  it('should render children', () => {
    props.onSelect = jest.fn()

    expect(createShallow().children().text()).toEqual('expected child')
  })

  it('should not render remove icon button component when prop "onRemove" function is undefined', () => {
    expect(createShallow().find(IconButton).exists()).toEqual(false)
  })

  it('should render remove icon button component when prop "onRemove" function is defined', () => {
    const wrapper = createShallow()
    wrapper.setProps({onRemove: () => {}})

    expect(wrapper.find(IconButton).exists()).toEqual(true)
  })

  it('should pass expected props to icon button component', () => {
    const wrapper = createShallow()
    wrapper.setProps({onRemove: () => {}})

    expect(wrapper.find(IconButton).props()).toContainObject({
      className: 'my-chip__remove-button',
      type: 'times',
      disabled: false
    })
  })

  it('should disable icon button component when prop "disabled" is true', () => {
    const wrapper = createShallow()
    wrapper.setProps({
      disabled: true,
      onRemove: () => {}
    })

    expect(wrapper.find(IconButton).prop('disabled')).toEqual(true)
  })

  it('should trigger prop "onRemove" function with prop "value" when icon button component clicked', () => {
    const wrapper = createShallow()
    props.onRemove = jest.fn()
    wrapper.setProps(props)
    wrapper.find(IconButton).props().onClick()

    expect(props.onRemove).toHaveBeenCalledWith('test')
  })
})
