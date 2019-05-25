import React from 'react'
import {Icon} from './Icon'
import {mount} from 'enzyme'

describe('Icon', () => {

  const createWrapper = (type, inverse = false) => mount(<Icon type={type} inverse={inverse} />)

  it('should set expected class for icon', () => {
    expect(createWrapper('times').find('span').prop('className')).toEqual('my-icon my-icon__times')
  })

  it('should invert color when prop "inverse" ist set to true', () => {
    const spy = spyOn(CSSStyleDeclaration.prototype, 'setProperty')
    createWrapper('times', true)

    expect(spy).toHaveBeenCalledWith('--color', '#FFFFFF')
  })

  it('should not invert color when prop "inverse" ist set to false', () => {
    const spy = spyOn(CSSStyleDeclaration.prototype, 'setProperty')
    createWrapper('times')

    expect(spy).toHaveBeenCalledWith('--color', '#808080')
  })
})
