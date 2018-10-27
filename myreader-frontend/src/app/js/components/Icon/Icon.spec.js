import React from 'react'
import Icon from './Icon'
import {shallow} from 'enzyme'

describe('Icon', () => {

  it('should pass expected props to font awesome component', () => {
    expect(shallow(<Icon type='close' inverse={true} />).props()).toContainObject({
      icon: 'close',
      inverse: true,
      fixedWidth: true
    })
  })
})
