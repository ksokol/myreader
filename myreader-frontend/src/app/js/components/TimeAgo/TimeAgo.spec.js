import TimeAgo from './TimeAgo'

jest.mock('./formatTimeAgo', () => date => `formatTimeAgo(${date})`)

describe('TimeAgo', () => {

  it('should format date', () => {
    expect(TimeAgo({date: '2018-01-01T00:00:00Z'})).toEqual('formatTimeAgo(2018-01-01T00:00:00Z)')
  })
})
