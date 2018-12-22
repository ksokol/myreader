import React from 'react'
import {mount} from 'enzyme'
import AutocompleteInput from './AutocompleteInput'
import {Input} from '..'

describe('AutocompleteInput', () => {

  let props

  const createComponent = () => mount(<AutocompleteInput {...props} />)

  const innerText = (acc, li) => [...acc, li.text()]

  beforeEach(() => {
    props = {
      name: 'expected-name',
      value: 'expected value',
      placeholder: 'expected placeholder',
      values: ['tag1', 'tag2', 'other'],
      onSelect: jest.fn()
    }
  })

  it('should pass expected props to input component', () => {
    props.disabled = true

    expect(createComponent().find(Input).props()).toContainObject({
      id: 'expected-name-input',
      name: 'expected-name',
      value: 'expected value',
      placeholder: 'expected placeholder',
      disabled: true
    })
  })

  it('should trigger prop function "onSelect" when input value changed', () => {
    const wrapper = createComponent()

    wrapper.find('input').simulate('change', {target: {value: 't'}})
    expect(props.onSelect).toHaveBeenCalledWith('t')

    wrapper.find('input').simulate('change', {target: {value: 'ta'}})
    expect(props.onSelect).toHaveBeenCalledWith('ta')

    wrapper.find('input').simulate('change', {target: {value: ''}})
    expect(props.onSelect).toHaveBeenCalledWith(null)
  })

  it('should not render autocomplete elements', () => {
    expect(createComponent().find('li').reduce(innerText, [])).toEqual([])
  })

  it('should render autocomplete elements which are starting with given input value', () => {
    const wrapper = createComponent()

    wrapper.find('input').simulate('change', {target: {value: 't'}})
    expect(wrapper.find('li').reduce(innerText, [])).toEqual(['tag1', 'tag2'])

    wrapper.find('input').simulate('change', {target: {value: 'tag2'}})
    expect(wrapper.find('li').reduce(innerText, [])).toEqual(['tag2'])

    wrapper.find('input').simulate('change', {target: {value: ''}})
    expect(wrapper.find('li').reduce(innerText, [])).toEqual(['tag1', 'tag2', 'other'])

    wrapper.find('input').simulate('change', {target: {value: 'value'}})
    expect(wrapper.find('li').reduce(innerText, [])).toEqual([])
  })

  it('should highlight text fragments which are starting with given input value', () => {
    const wrapper = createComponent()

    wrapper.find('input').simulate('change', {target: {value: 'ta'}})
    expect(wrapper.find('li').find('.my-autocomplete-input__item--highlight').reduce(innerText, [])).toEqual(['ta', 'ta'])

    wrapper.find('input').simulate('change', {target: {value: ''}})
    expect(wrapper.find('li').find('.my-autocomplete-input__item--highlight').reduce(innerText, [])).toEqual(['', '', ''])
  })

  it('should mark autocomplete element as selected on key arrow up and down', () => {
    const wrapper = createComponent()
    wrapper.find('input').simulate('change', {target: {value: 'ta'}})

    expect(wrapper.find('.my-autocomplete-input__item--selected').exists()).toEqual(false)

    wrapper.find('input').simulate('keyDown', {key: 'ArrowDown'})
    wrapper.find('input').simulate('keyDown', {key: 'ArrowDown'})
    expect(wrapper.find('.my-autocomplete-input__item--selected').text()).toEqual('tag2')

    wrapper.find('input').simulate('keyDown', {key: 'ArrowUp'})
    expect(wrapper.find('.my-autocomplete-input__item--selected').text()).toEqual('tag1')
  })
})
