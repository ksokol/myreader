import React from 'react'
import {mount} from 'enzyme'
import {AutocompleteInput} from './AutocompleteInput'

describe('AutocompleteInput', () => {

  let props

  const createWrapper = () => mount(<AutocompleteInput {...props} />)

  beforeEach(() => {
    props = {
      id: 'expected-id',
      name: 'expected-name',
      value: 'expected value',
      placeholder: 'expected placeholder',
      values: ['tag1', 'tag2', 'other'],
      autoComplete: 'on',
      onSelect: jest.fn()
    }
  })

  it('should pass expected props to input component', () => {
    props.disabled = true

    expect(createWrapper().find('Input').props()).toEqual(expect.objectContaining({
      id: 'expected-id',
      name: 'expected-name',
      value: 'expected value',
      placeholder: 'expected placeholder',
      disabled: true
    }))
  })

  it('should trigger prop function "onSelect" when input value changed', () => {
    const wrapper = createWrapper()

    wrapper.find('input').simulate('change', {target: {value: 't'}})
    expect(props.onSelect).toHaveBeenCalledWith('t')

    wrapper.find('input').simulate('change', {target: {value: 'ta'}})
    expect(props.onSelect).toHaveBeenCalledWith('ta')

    wrapper.find('input').simulate('change', {target: {value: ''}})
    expect(props.onSelect).toHaveBeenCalledWith(null)
  })

  it('should connect datalist to input', () => {
    const wrapper = createWrapper()
    const input = wrapper.find('input')
    const datalist = wrapper.find('datalist')

    expect(input.prop('list')).toBeTruthy()
    expect(input.prop('list')).toEqual(datalist.prop('id'))
  })

  it('should render prop "values" as datalist options', () => {
    const options = createWrapper().find('datalist > option').map(option => option.prop('value'))

    expect(options).toEqual(['tag1', 'tag2', 'other'])
  })
})
