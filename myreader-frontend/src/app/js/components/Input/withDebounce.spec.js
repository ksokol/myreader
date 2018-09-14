import React from 'react'
import withDebounce from './withDebounce'
import ReactTestRenderer from 'react-test-renderer'

const ComponentToWrap = () => <wrapped-component />

describe('src/app/js/components/Input/withDebounce.spec.js', () => {

  let props

  beforeEach(() => {
    jest.useRealTimers()

    props = {
      value: 'a value',
      onChange: jest.fn()
    }
  })

  const createInstance = ({debounceTime} = {}) => {
    const WrappedComponent = withDebounce(ComponentToWrap, debounceTime)
    return ReactTestRenderer.create(<WrappedComponent {...props} />).root
  }

  it('should render wrapped component', () => {
    expect(createInstance().children[0].type().type).toEqual('wrapped-component')
  })

  it('should trigger prop "onChange" function immediately', () => {
    const instance = createInstance()
    instance.children[0].props.onChange('expected call')

    expect(instance.props.onChange).toHaveBeenCalledWith('expected call')
  })

  it('should debounce prop "onChange" function for 250ms', done => {
    const instance = createInstance({debounceTime: 250})
    instance.children[0].props.onChange('expected call')

    expect(instance.props.onChange).not.toHaveBeenCalled()

    // TODO Workaround for https://github.com/facebook/jest/issues/5165
    setTimeout(() => {
      expect(instance.props.onChange).toHaveBeenCalledWith('expected call')
      done()
    }, 250)
  })

  it('should pass changed prop "value" back to wrapped component immediately when prop "onChange" function triggered', () => {
    const instance = createInstance({debounceTime: 250})
    instance.children[0].props.onChange('expected value')

    expect(instance.children[0].props.value).toEqual('expected value')
  })
})
