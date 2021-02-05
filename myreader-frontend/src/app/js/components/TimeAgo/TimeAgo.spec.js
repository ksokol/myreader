import React from 'react'
import {TimeAgo} from './TimeAgo'
import {shallow} from 'enzyme'

describe('TimeAgo', () => {

  it('should format date', () => {
    jest.spyOn(Date, 'now').mockImplementation(() => new Date('2018-01-15T00:00:00Z'))

    expect(shallow(<TimeAgo date='2018-01-01T00:00:00Z' />).text()).toEqual('2 weeks ago')
  })
})
