import React from 'react'
import IntersectionObserver from './IntersectionObserver'
import {mount} from 'enzyme'

describe('IntersectionObserver', () => {

  let props, observer, wrapper

  beforeEach(() => {
    props = {
      onIntersection: jest.fn()
    }

    observer = {
      observe: jest.fn(),
      disconnect: jest.fn()
    }

    window.IntersectionObserver = jest.fn().mockImplementationOnce(() => observer)
    wrapper = mount(<IntersectionObserver {...props}>expected children</IntersectionObserver>)
  })

  afterEach(() => {
    delete window['IntersectionObserver']
  })

  const intersect = intersections => {
    window.IntersectionObserver.mock.calls[0][0](intersections.map(isIntersecting => ({isIntersecting})))
  }

  it('should render children', () => {
    expect(wrapper.props().children).toEqual('expected children')
  })

  it('should observe intersections on instance ref', () => {
    expect(observer.observe).toHaveBeenCalledWith(wrapper.instance().myRef.current)
  })

  it('should not trigger prop "onIntersection" function when first target does not intersect', () => {
    intersect([false, true])
    expect(props.onIntersection).not.toHaveBeenCalled()
  })

  it('should trigger prop "onIntersection" function when first target intersects', () => {
    intersect([true, true])
    expect(props.onIntersection).toHaveBeenCalledTimes(1)
  })

  it('should trigger prop "onIntersection" function on subsequent intersections', () => {
    intersect([false])
    expect(props.onIntersection).not.toHaveBeenCalled()

    intersect([true])
    intersect([true])
    expect(props.onIntersection).toHaveBeenCalledTimes(2)
  })
})
