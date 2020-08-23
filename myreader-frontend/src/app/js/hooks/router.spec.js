import React, {useContext} from 'react'
import {mount, shallow} from 'enzyme'
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

  describe('useHistory', () => {

    it('push', () => {
      useLocation.mockReturnValueOnce({a: 'b', c: 'd', search: 'e=f'})
      let push

      function TestComponent() {
        push = useHistory().push
        return null
      }

      shallow(<TestComponent />)

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
