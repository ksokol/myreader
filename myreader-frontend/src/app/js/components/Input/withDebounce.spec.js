import React from 'react'
import withDebounce from './withDebounce'
import {mount} from 'enzyme'

const ComponentToWrap = () => <p>wrapped component</p>

describe('withDebounce', () => {

  let props

  beforeEach(() => {
    jest.useRealTimers()

    props = {
      value: 'a value',
      onChange: jest.fn()
    }
  })

  const createComponent = ({debounceTime} = {}) => {
    const WrappedComponent = withDebounce(ComponentToWrap, debounceTime)
    return mount(<WrappedComponent {...props} />)
  }

  it('should render wrapped component', () => {
    expect(createComponent().find('p').text()).toEqual('wrapped component')
  })

  it('should trigger prop "onChange" function immediately', () => {
    createComponent().children().props().onChange('expected call')

    expect(props.onChange).toHaveBeenCalledWith('expected call')
  })

  it('should debounce prop "onChange" function for 250ms', done => {
    const event = {target: {value: 'expected call'}, persist: jest.fn()}
    createComponent({debounceTime: 250}).children().props().onChange({...event})

    expect(props.onChange).not.toHaveBeenCalled()

    // TODO Workaround for https://github.com/facebook/jest/issues/5165
    setTimeout(() => {
      expect(props.onChange).toHaveBeenCalledWith({...event})
      done()
    }, 250)
  })

  it('should pass changed prop "value" back to wrapped component immediately when prop "onChange" function triggered', () => {
    const wrapper = createComponent({debounceTime: 250})
    wrapper.children().props().onChange({target: {value: 'expected value'}, persist: jest.fn()})
    wrapper.update()

    expect(wrapper.children().prop('value')).toEqual('expected value')
  })
})
