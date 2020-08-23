import {useSearchParams} from './useSearchParams'
import {useLocation} from 'react-router'

jest.mock('react-router', () => ({
  useLocation: jest.fn().mockReturnValueOnce({})
}))

describe('useSearchParams', () => {

  it('should return empty object when search is undefined', () => {
    expect(useSearchParams()).toEqual({})
  })

  it('should return search string as object', () => {
    useLocation.mockReturnValueOnce({search: '?a=b&c=d'})

    expect(useSearchParams()).toEqual({a: 'b', c: 'd',})
  })

  it('should return empty string for key when value in search query is undefined', () => {
    useLocation.mockReturnValueOnce({search: '?a'})

    expect(useSearchParams()).toEqual({a: ''})
  })
})
