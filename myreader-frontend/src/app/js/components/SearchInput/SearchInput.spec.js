import React from 'react'
import {mount} from 'enzyme'
import SearchInput from './SearchInput'
import {Input} from '../Input'

describe('SearchInput', () => {

  let props

  const createComponent = () => mount(<SearchInput {...props} />)

  beforeEach(() => {
    props = {
      onChange: jest.fn(),
      className: 'expected-class'
    }
  })

  it('should pass expected class to host node', () => {
    expect(createComponent().first().props()).toContainObject({className: 'expected-class'})
  })

  it('should set default value', () => {
    expect(createComponent().find(Input).prop('value')).toEqual('')
  })

  it('should set initial value', () => {
    props.value = 'a value'

    expect(createComponent().find(Input).prop('value')).toEqual('a value')
  })

  it('should trigger prop function "onChange" after a predefined amount of time', done => {
    jest.useRealTimers()
    createComponent().find(Input).props().onChange({target: {value: 'changed value'}, persist: jest.fn()})

    // TODO Workaround for https://github.com/facebook/jest/issues/5165
    setTimeout(() => {
      expect(props.onChange).toHaveBeenCalledWith('changed value')
      done()
    }, 250)
  })
})
