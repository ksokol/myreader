import React from 'react'
import {shallow} from '../../shared/test-utils'
import Chips from './Chips'

describe('src/app/js/components/chips/chips.spec.js', () => {

  let props

  beforeEach(() => {
    props = {
      keyFn: value => `keyFn: ${value}`,
      values: ['value1', 'value2'],
      selected: 'value2',
      placeholder: 'expected placeholder',
      onSelect: jest.fn(),
      onRemove: jest.fn(),
      renderItem: value => `rendered: ${value}`
    }
  })

  it('should create a chip component instance for every value in prop "values"', () => {
    const {output} = shallow(<Chips {...props} />)
    const children = output().props.children[0].props.children

    expect(children[0]).toContainObject({
      key: 'keyFn: value1',
      props: {
        value: 'value1',
        selected: 'value2',
        disabled: false,
        children: 'rendered: value1',
        onSelect: props.onSelect,
        onRemove: props.onRemove
      }
    })

    expect(children[1]).toContainObject({
      key: 'keyFn: value2',
      props: {
        value: 'value2',
        selected: 'value2',
        disabled: false,
        children: 'rendered: value2',
        onSelect: props.onSelect,
        onRemove: props.onRemove
      }
    })
  })

  it('should return key from prop "keyFn" function for every chip component instance' , () => {
    const {output} = shallow(<Chips {...props} />)
    const children = output().props.children[0].props.children

    expect(children[0].props.keyFn()).toEqual('keyFn: value1')
    expect(children[1].props.keyFn()).toEqual('keyFn: value2')
  })

  it('should not render input component when prop "onAdd" function is undefined', () => {
    const {output} = shallow(<Chips {...props} />)

    expect(output().props.children[1]).toBeUndefined()
  })

  it('should render input component when prop "onAdd" function is defined', () => {
    props.onAdd = jest.fn()
    const {output} = shallow(<Chips {...props} />)

    expect(output().props.children[1]).toBeDefined()
  })

  it('should pass expected props to input component', () => {
    props.onAdd = jest.fn()
    const {output} = shallow(<Chips {...props} />)

    expect(output().props.children[1].props.children.props).toContainObject({
      disabled: false,
      placeholder: 'expected placeholder',
      value: ''
    })
  })

  it('should trigger prop "onAdd" function when input value changed and enter key pressed', () => {
    props.onAdd = jest.fn()
    const {output} = shallow(<Chips {...props} />)
    const hotkeysProps = output().props.children[1].props

    hotkeysProps.children.props.onChange('expected value')
    hotkeysProps.onKeys.enter()

    expect(props.onAdd).toHaveBeenCalledWith('expected value')
  })

  it('should not trigger prop "onAdd" function when input value is an empty string and enter key pressed', () => {
    props.onAdd = jest.fn()
    const {output} = shallow(<Chips {...props} />)
    const hotkeysProps = output().props.children[1].props

    hotkeysProps.children.props.onChange('')
    hotkeysProps.onKeys.enter()

    expect(props.onAdd).not.toHaveBeenCalled()
  })

  it('should reset prop "value" of input component when input value changed and enter key pressed', () => {
    props.onAdd = jest.fn()
    const {output} = shallow(<Chips {...props} />)
    let hotkeysProps = output().props.children[1].props

    hotkeysProps.children.props.onChange('expected value')
    hotkeysProps.onKeys.enter()
    hotkeysProps = output().props.children[1].props

    expect(hotkeysProps.children.props).toContainObject({value: ''})
  })

  it('should not reset prop "value" of input component when input value changed but enter key not pressed', () => {
    props.onAdd = jest.fn()
    const {output} = shallow(<Chips {...props} />)
    let hotkeysProps = output().props.children[1].props

    hotkeysProps.children.props.onChange('expected value')
    hotkeysProps = output().props.children[1].props

    expect(hotkeysProps.children.props).toContainObject({value: 'expected value'})
  })
})
