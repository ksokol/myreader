import React from 'react'
import {mount} from 'enzyme'
import SearchInput from './SearchInput'
import {withDebounce} from '../../components'

/* eslint-disable react/prop-types, react/display-name */
jest.mock('../../components', () => ({
  withDebounce: jest.fn().mockImplementation(Component => props => <Component {...props} />),
  Input: props => <div {...props} />,
  Icon: () => null
}))
/* eslint-enable */

describe('SearchInput', () => {

  let props

  const createWrapper = () => mount(<SearchInput {...props} />)

  beforeEach(() => {
    props = {
      onChange: jest.fn(),
      className: 'expected-class'
    }
  })

  it('should pass expected class to host node', () => {
    expect(createWrapper().first().prop('className')).toEqual('expected-class')
  })

  it('should set default value when prop "value" is undefined', () => {
    expect(createWrapper().find('Input').prop('value')).toEqual('')
  })

  it('should set default value when prop "value" is null', () => {
    props.value = null
    expect(createWrapper().find('Input').prop('value')).toEqual('')
  })

  it('should set initial value', () => {
    props.value = 'a value'

    expect(createWrapper().find('Input').prop('value')).toEqual('a value')
  })

  it('should debounce input for a predefined amount of time', () => {
    createWrapper()

    expect(withDebounce).toHaveBeenCalledWith(expect.any(Function), 250)
  })
})
