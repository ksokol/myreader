import {Badge} from '.'
import React from 'react'
import {render} from 'enzyme'

describe('src/app/js/components/Badge/Badge.spec.js', () => {

  it('should render Badge with count 2', () => {
    expect(render(<Badge count={2} />).text()).toEqual('2')
  })

  it('should render badge with default count 0', () => {
    expect(render(<Badge />).text()).toEqual('0')
  })
})
