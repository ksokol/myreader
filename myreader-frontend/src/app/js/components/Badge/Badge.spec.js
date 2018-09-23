import {Badge} from '.'
import React from 'react'
import {render} from 'enzyme'

describe('Badge', () => {

  it('should render Badge with given text', () => {
    expect(render(<Badge text='sample text' />).text()).toEqual('sample text')
  })
})
