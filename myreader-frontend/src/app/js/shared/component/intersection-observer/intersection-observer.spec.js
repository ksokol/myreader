import React from 'react'
import IntersectionObserver from './intersection-observer'
import {renderIntoDocument} from 'react-dom/test-utils'

describe('src/app/js/shared/component/intersection-observer/intersection-observer.spec.js', () => {

  let props, observer, instance

  beforeEach(() => {
    props = {
      onIntersection: jest.fn()
    }

    observer = {
      observe: jest.fn(),
      disconnect: jest.fn()
    }

    jest.spyOn(window, 'IntersectionObserver').mockImplementationOnce(() => observer)
    instance = renderIntoDocument(<IntersectionObserver {...props}>expected children</IntersectionObserver>)
  })

  const intersect = intersections => window.IntersectionObserver.mock.calls[0][0](intersections.map(isIntersecting => ({isIntersecting})))

  afterEach(() => window.IntersectionObserver.mockClear())

  it('should render children', () => {
    expect(instance.props.children).toEqual('expected children')
  })

  it('should observe intersections on instance ref', () => {
    expect(observer.observe).toHaveBeenCalledWith(instance.myRef.current)
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
