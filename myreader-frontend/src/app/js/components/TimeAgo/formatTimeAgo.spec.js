import {formatTimeAgo} from './formatTimeAgo'

const givenDate = (now, date = '2018-01-01T00:00:00Z') => {
  jest.spyOn(Date, 'now').mockImplementation(() => new Date(now))
  return formatTimeAgo(date)
}

describe('formatTimeAgo', () => {

  it('should format to "sometime" when given date is null', () => {
    expect(givenDate('2018-01-01T00:00:00Z', null)).toEqual('sometime')
  })

  it('should format to "in 1 second" when given date is in the future', () => {
    expect(givenDate('2018-01-01T00:00:00Z', '2018-01-01T00:00:00.001Z')).toEqual('in 1 second')
  })

  it('should format to "1 second ago"', () => {
    expect(givenDate('2018-01-01T00:00:00Z')).toEqual('1 second ago')
  })

  it('should format to "1 second ago" ignoring milliseconds', () => {
    expect(givenDate('2018-01-01T00:00:00.999Z')).toEqual('1 second ago')
  })

  it('should format to "1 second ago"', () => {
    expect(givenDate('2018-01-01T00:00:01Z')).toEqual('1 second ago')
  })

  it('should format to "10 seconds ago" ignoring milliseconds', () => {
    expect(givenDate('2018-01-01T00:00:10.734Z')).toEqual('10 seconds ago')
  })

  it('should format to "59 seconds ago"', () => {
    expect(givenDate('2018-01-01T00:00:59Z')).toEqual('59 seconds ago')
  })

  it('should format to "1 minute ago"', () => {
    expect(givenDate('2018-01-01T00:01:00Z')).toEqual('1 minute ago')
  })

  it('should format to "59 minutes ago"', () => {
    expect(givenDate('2018-01-01T00:59:59Z')).toEqual('59 minutes ago')
  })

  it('should format to "59 minutes ago" ignoring milliseconds', () => {
    expect(givenDate('2018-01-01T00:59:59.734Z')).toEqual('59 minutes ago')
  })

  it('should format to "1 hour ago"', () => {
    expect(givenDate('2018-01-01T01:00:00Z')).toEqual('1 hour ago')
  })

  it('should format to "23 hours ago"', () => {
    expect(givenDate('2018-01-01T23:59:59Z')).toEqual('23 hours ago')
  })

  it('should format to "23 hours ago" ignoring milliseconds', () => {
    expect(givenDate('2018-01-01T23:59:59.734Z')).toEqual('23 hours ago')
  })

  it('should format to "1 day ago"', () => {
    expect(givenDate('2018-01-02T00:00:00Z')).toEqual('1 day ago')
  })

  it('should format to "6 days ago"', () => {
    expect(givenDate('2018-01-07T23:59:59Z')).toEqual('6 days ago')
  })

  it('should format to "6 days ago" ignoring milliseconds', () => {
    expect(givenDate('2018-01-07T23:59:59.734Z')).toEqual('6 days ago')
  })

  it('should format to "1 week ago"', () => {
    expect(givenDate('2018-01-08T00:00:00Z')).toEqual('1 week ago')
  })

  it('should format to "3 weeks ago"', () => {
    expect(givenDate('2018-01-28T23:59:59Z')).toEqual('3 weeks ago')
  })

  it('should format to "3 weeks ago" ignoring milliseconds', () => {
    expect(givenDate('2018-01-28T23:59:59.734Z')).toEqual('3 weeks ago')
  })

  it('should format to "4 weeks ago"', () => {
    expect(givenDate('2018-01-29T00:00:00Z')).toEqual('4 weeks ago')
  })

  it('should format to "1 month ago" on last second of week', () => {
    expect(givenDate('2018-02-04T23:59:59Z')).toEqual('1 month ago')
  })

  it('should format to "1 month ago"', () => {
    expect(givenDate('2018-02-05T00:00:00Z')).toEqual('1 month ago')
  })

  it('should format to "1 month ago" on last second month', () => {
    expect(givenDate('2018-02-28T23:59:59Z')).toEqual('1 month ago')
  })

  it('should format to "1 month ago"', () => {
    expect(givenDate('2018-03-01T00:00:00Z')).toEqual('1 month ago')
  })

  it('should format to "10 months ago"', () => {
    expect(givenDate('2018-11-30T23:59:59Z')).toEqual('10 months ago')
  })

  it('should format to "10 months ago"', () => {
    expect(givenDate('2018-12-01T00:00:00Z')).toEqual('10 months ago')
  })

  it('should format to "11 months ago" on last second of month', () => {
    expect(givenDate('2018-12-31T23:59:59Z')).toEqual('11 months ago')
  })

  it('should format to "1 year ago"', () => {
    expect(givenDate('2019-01-01T00:00:00Z')).toEqual('1 year ago')
  })

  it('should format to "1 years ago" on last second of year', () => {
    expect(givenDate('2019-12-31T23:59:59Z')).toEqual('1 year ago')
  })

  it('should format to "2 years ago"', () => {
    expect(givenDate('2020-01-01T00:00:00Z')).toEqual('2 years ago')
  })

  it('should format to "3 years ago" on last second of year', () => {
    expect(givenDate('2020-12-31T23:59:59Z')).toEqual('3 years ago')
  })

  it('should format to "3 years ago"', () => {
    expect(givenDate('2021-01-01T00:00:00Z')).toEqual('3 years ago')
  })

  it('should format to "in 1 year"', () => {
    expect(givenDate('2021-02-05T08:02:27.685+00:00', '2022-12-25T08:02:27.685Z')).toEqual('in 1 year')
  })
})
