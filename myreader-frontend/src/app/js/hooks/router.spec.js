import React, {useContext} from 'react'
import {mount} from 'enzyme'
import {useHistory, useSearchParams} from './router'
import {useLocation, useHistory as useRouterHistory} from 'react-router'
import {LocationStateProvider} from '../contexts/locationState/LocationStateProvider'
import LocationStateContext from '../contexts/locationState/LocationStateContext'

jest.mock('react-router', () => {
  const push = jest.fn()

  return {
    useLocation: jest.fn(),
    useHistory: () => ({
      push,
    }),
  }
})

describe('router', () => {

  beforeEach(() => {
    useLocation.mockClear()
    useRouterHistory().push.mockClear()
  })

  describe('useSearchParams', () => {

    let searchParams

    function TestComponent() {
      searchParams = useSearchParams()
      return null
    }

    it('should return empty object when search is undefined', () => {
      useLocation.mockReturnValueOnce({search: ''})
      mount(<TestComponent />)

      expect(searchParams).toEqual({})
    })

    it('should return search string as object', () => {
      useLocation.mockReturnValueOnce({search: '?a=b&c=d'})
      mount(<TestComponent />)

      expect(searchParams).toEqual({a: 'b', c: 'd',})
    })

    it('should return empty string for key when value in search query is undefined', () => {
      useLocation.mockReturnValueOnce({search: '?a'})
      mount(<TestComponent />)

      expect(searchParams).toEqual({a: ''})
    })

    it('should not return a new object if search query does not change', () => {
      useLocation.mockReturnValueOnce({search: '?b'})
      const wrapper = mount(<TestComponent />)
      const call1 = searchParams

      useLocation.mockReturnValueOnce({search: '?b'})
      wrapper.mount()

      expect(call1 === searchParams).toEqual(true)
    })
  })

  describe('useHistory', () => {

    it('push', () => {
      useLocation.mockReturnValueOnce({a: 'b', c: 'd', search: 'e=f'})
      let push

      function TestComponent() {
        push = useHistory().push
        return null
      }

      mount(<TestComponent />)

      push({
        searchParams: {
          g: 'h',
          i: undefined,
          j: null,
          k: 'l'
        }
      })

      expect(useRouterHistory().push).toHaveBeenCalledWith({
        a: 'b',
        c: 'd',
        search: 'g=h&k=l',
      })
    })

    it('reload', done => {
      jest.useRealTimers()

      let reload

      function TestComponent() {
        const {locationStateStamp} = useContext(LocationStateContext)
        reload = useHistory().reload
        return locationStateStamp
      }

      const wrapper = mount(
        <LocationStateProvider>
          <TestComponent />
        </LocationStateProvider>
      )

      const before = wrapper.html()

      setTimeout(() => {
        reload()
        wrapper.update()
        const after = wrapper.html()

        expect(Number(after)).toBeGreaterThan(Number(before))
        done()
      }, 100)
    })
  })
})
