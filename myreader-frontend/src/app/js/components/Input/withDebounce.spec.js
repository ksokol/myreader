import React from 'react'
import withDebounce from './withDebounce'
import {mount} from 'enzyme'

const ComponentToWrap = () => <p>wrapped component</p>

describe('src/app/js/components/Input/withDebounce.spec.js', () => {

  let props

  beforeEach(() => {
    jest.useRealTimers()

    props = {
      value: 'a value',
      onChange: jest.fn()
    }
  })

  const createMount = ({debounceTime} = {}) => {
    const WrappedComponent = withDebounce(ComponentToWrap, debounceTime)
    return mount(<WrappedComponent {...props} />)
  }

  it('should render wrapped component', () => {
    expect(createMount().find('p').text()).toEqual('wrapped component')
  })

  it('should trigger prop "onChange" function immediately', () => {
    createMount().children().props().onChange('expected call')

    expect(props.onChange).toHaveBeenCalledWith('expected call')
  })

  it('should debounce prop "onChange" function for 250ms', done => {
    createMount({debounceTime: 250}).children().props().onChange('expected call')

    expect(props.onChange).not.toHaveBeenCalled()

    // TODO Workaround for https://github.com/facebook/jest/issues/5165
    setTimeout(() => {
      expect(props.onChange).toHaveBeenCalledWith('expected call')
      done()
    }, 250)
  })

  it('should pass changed prop "value" back to wrapped component immediately when prop "onChange" function triggered', () => {
    const wrapper = createMount({debounceTime: 250})
    wrapper.children().props().onChange('expected value')
    wrapper.update()

    expect(wrapper.children().prop('value')).toEqual('expected value')
  })
})
