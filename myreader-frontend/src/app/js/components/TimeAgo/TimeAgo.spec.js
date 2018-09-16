import TimeAgo from './TimeAgo'

describe('TimeAgo', () => {

  beforeEach(() => {
    const _Date = Date

    global['Date'] = jest.fn(args => new _Date(args || '2018-04-27T18:01:03Z'))
  })

  it('should format date', () => {
    expect(TimeAgo({date: '2018-04-25T18:01:03Z'})).toEqual('2 days ago')
  })
})
