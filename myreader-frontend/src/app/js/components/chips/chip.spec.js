import Chip from './chip'
import React from 'react'
import TestRenderer from 'react-test-renderer'

describe('src/app/js/components/chips/chip.spec.js', () => {

  let props

  beforeEach(() => {
    props = {
      keyFn: () => 'test',
      value: 'test'
    }
  })

  const createInstance = () => TestRenderer.create(<Chip {...props}>expected child</Chip>).root.children[0]

  it('should not mark as selected', () => {
    expect(createInstance().props.className).not.toEqual('my-chip my-chip--selected')
  })

  it('should mark as selected', () => {
    props.selected = 'test'

    expect(createInstance().props.className).toEqual('my-chip my-chip--selected')
  })

  it('should not mark as selectable when prop "selected" equals prop "keyFn" function return value but prop "onSelect" function is undefined', () => {
    props.selected = 'test'

    expect(createInstance().props.className).not.toEqual('my-chip my-chip--selectable')
  })

  it('should not mark as selectable when already selected', () => {
    props.selected = 'test'
    props.onSelect = () => {}

    expect(createInstance().props.className).not.toEqual('my-chip my-chip--selectable')
  })

  it('should mark as selectable when not selected and prop "onSelect" function is defined', () => {
    props.onSelect = () => {}

    expect(createInstance().props.className).toEqual('my-chip my-chip--selectable')
  })

  it('should not mark as selectable when prop "disabled" is true', () => {
    props.onSelect = () => {}
    props.disabled = true

    expect(createInstance().props.className).toEqual('my-chip my-chip--disabled')
  })

  it('should mark as selectable when prop "keyFn" function returns "other"', () => {
    props.keyFn = () => 'other'
    props.onSelect = () => {}

    expect(createInstance().props.className).toEqual('my-chip my-chip--selectable')
  })

  it('should trigger prop "onSelect" function on click', () => {
    props.onSelect = jest.fn()
    createInstance().props.children[0].props.onClick()

    expect(props.onSelect).toHaveBeenCalled()
  })

  it('should not trigger prop "onSelect" function on click when prop "disabled" is true', () => {
    props.disabled = true
    props.onSelect = jest.fn()
    createInstance().props.children[0].props.onClick()

    expect(props.onSelect).not.toHaveBeenCalled()
  })

  it('should render children', () => {
    props.onSelect = jest.fn()

    expect(createInstance().children[0].children).toEqual(['expected child'])
  })

  it('should not render remove icon button component when prop "onRemove" function is undefined', () => {
    expect(createInstance().children[1]).toBeUndefined()
  })

  it('should render remove icon button component when prop "onRemove" function is defined', () => {
    props.onRemove = jest.fn()

    expect(createInstance().children[1]).toBeDefined()
  })

  it('should pass expected props to icon button component', () => {
    props.onRemove = jest.fn()

    expect(createInstance().children[1].props).toContainObject({
      className: 'my-chip__remove-button',
      type: 'close',
      disabled: false
    })
  })

  it('should disable icon button component when prop "disabled" is true', () => {
    props.onRemove = jest.fn()
    props.disabled = true

    expect(createInstance().children[1].props).toContainObject({
      disabled: true
    })
  })

  it('should trigger prop "onRemove" function with prop "value" when icon button component clicked', () => {
    props.onRemove = jest.fn()
    createInstance().children[1].props.onClick()

    expect(props.onRemove).toHaveBeenCalledWith('test')
  })
})
