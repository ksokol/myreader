import React from 'react'
import TimeAgo from './TimeAgo'
import {shallow} from 'enzyme'

jest.mock('./formatTimeAgo', () => date => `formatTimeAgo(${date})`) //eslint-disable-line unicorn/consistent-function-scoping

describe('TimeAgo', () => {

  it('should format date', () => {
    expect(shallow(<TimeAgo date='2018-01-01T00:00:00Z' />).text()).toEqual('formatTimeAgo(2018-01-01T00:00:00Z)')
  })
})
