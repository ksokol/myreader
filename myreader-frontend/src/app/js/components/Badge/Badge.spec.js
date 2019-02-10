import Badge from './Badge'
import React from 'react'
import {mount} from 'enzyme'

describe('Badge', () => {

  const createMount = props => mount(<Badge {...props} />)

  it('should render component with given text', () => {
    expect(createMount({text: 'sample text'}).text()).toEqual('sample text')
  })

  it('should set CSS custom properties red, green and blue with default value', () => {
    const wrapper = createMount()
    const spy = jest.spyOn(wrapper.instance().badgeRef.current.style, 'setProperty')
    wrapper.instance().componentDidMount()

    expect(spy).toHaveBeenNthCalledWith(1, '--red', 119)
    expect(spy).toHaveBeenNthCalledWith(2, '--green', 119)
    expect(spy).toHaveBeenNthCalledWith(3, '--blue', 119)
  })

  it('should set CSS custom properties red, green and blue', () => {
    const wrapper = createMount({color: '#77A7EA'})
    const spy = jest.spyOn(wrapper.instance().badgeRef.current.style, 'setProperty')
    wrapper.instance().componentDidMount()

    expect(spy).toHaveBeenNthCalledWith(1, '--red', 119)
    expect(spy).toHaveBeenNthCalledWith(2, '--green', 167)
    expect(spy).toHaveBeenNthCalledWith(3, '--blue', 234)
  })

  it('should update CSS custom properties red, green and blue when prop "color" changed', () => {
    const wrapper = createMount({color: '#77A7EA'})
    const spy = jest.spyOn(wrapper.instance().badgeRef.current.style, 'setProperty')
    wrapper.instance().componentDidMount()
    wrapper.setProps({color: '#70CEE6'})

    expect(spy).toHaveBeenNthCalledWith(4, '--red', 112)
    expect(spy).toHaveBeenNthCalledWith(5, '--green', 206)
    expect(spy).toHaveBeenNthCalledWith(6, '--blue', 230)
  })

  it('should trigger function prop "onClick" when click on host node occurred', () => {
    const onClick = jest.fn()
    const wrapper = createMount({onClick})

    wrapper.find('.my-badge').props().onClick()
    expect(onClick).toHaveBeenCalledWith()
  })
})
