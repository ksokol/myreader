import React from 'react'
import {mount} from 'enzyme'
import {LocationStateProvider} from './LocationStateProvider'
import {withLocationState} from './withLocationState'

const WrappedComponent = () => <span>wrapped component</span>

const pathname = '/expected-path'

describe('locationState context', () => {

  let routerProps, props

  const createWrapper = () => {
    const Component = withLocationState(WrappedComponent)
    const mergedProps = {...props, ...routerProps}
    return mount(
      <LocationStateProvider {...routerProps}>
        <Component {...mergedProps} />
      </LocationStateProvider>
    )
  }

  beforeEach(() => {
    routerProps = {
      location: {
        pathname,
        search: '?a=b&c=d'
      },
      match: {
        params: {
          e: 'f',
          g: 'h'
        }
      },
      history: {
        push: jest.fn(),
        replace: jest.fn(),
      }
    }

    props = {
      prop1: 'value1',
      prop2: 'value2'
    }
  })

  it('should pass expected props to wrapped component', () => {
    expect(createWrapper().find('WrappedComponent').props()).toEqual({
      prop1: 'value1',
      prop2: 'value2',
      searchParams: {
        a: 'b',
        c: 'd'
      },
      params: {
        e: 'f',
        g: 'h'
      },
      locationChanged: false,
      locationReload: false,
      historyPush: expect.any(Function),
      historyReplace: expect.any(Function),
      historyReload: expect.any(Function)
    })
  })

  describe('should trigger prop function "props.history.push"', () => {

    it('with new search', () => {
      createWrapper().find('WrappedComponent').props().historyPush({searchParams: {i: 'j'}})

      expect(routerProps.history.push).toHaveBeenCalledWith({pathname, search: 'i=j'})
    })

    it('with empty search when "historyPush" called with undefined for key i', () => {
      createWrapper().find('WrappedComponent').props().historyPush({searchParams: {i: undefined, j: 'k'}})

      expect(routerProps.history.push).toHaveBeenCalledWith({pathname, search: 'j=k'})
    })

    it('with empty search when "historyPush" called with null for key i', () => {
      createWrapper().find('WrappedComponent').props().historyPush({searchParams: {i: null, j: 'k'}})

      expect(routerProps.history.push).toHaveBeenCalledWith({pathname, search: 'j=k'})
    })

    it('with empty search when "historyPush" called without searchParams', () => {
      createWrapper().find('WrappedComponent').props().historyPush()

      expect(routerProps.history.push).toHaveBeenCalledWith({pathname, search: ''})
    })

    it('with empty search when "historyPush" called with undefined searchParams', () => {
      createWrapper().find('WrappedComponent').props().historyPush({searchParams: undefined})

      expect(routerProps.history.push).toHaveBeenCalledWith({pathname, search: ''})
    })
  })

  describe('should trigger prop function "props.history.replace"', () => {

    it('with new path', () => {
      createWrapper().find('WrappedComponent').props().historyReplace({pathname: '/expected-new-path'})

      expect(routerProps.history.replace).toHaveBeenCalledWith({
        pathname: '/expected-new-path'
      })
    })

    it('with new path and parameter value', () => {
      createWrapper().find('WrappedComponent').props().historyReplace({pathname: '/expected-new-path/:i', params: {i: 'j'}})

      expect(routerProps.history.replace).toHaveBeenCalledWith({
        pathname: '/expected-new-path/j'
      })
    })
  })

  it('should set prop "locationReload" once only to true when prop function "props.reload" triggered', () => {
    const wrapper = createWrapper()

    expect(wrapper.find('WrappedComponent').prop('locationReload')).toEqual(false)
    wrapper.find('WrappedComponent').props().historyReload()
    wrapper.update()

    expect(wrapper.find('WrappedComponent').prop('locationReload')).toEqual(true)

    wrapper.setProps({a: 1})
    expect(wrapper.find('WrappedComponent').prop('locationReload')).toEqual(false)
  })

  it('should set prop "locationChanged" to true when prop "location.search" changed', done => {
    const wrapper = createWrapper()
    expect(wrapper.find('WrappedComponent').prop('locationChanged')).toEqual(false)

    routerProps.location.search = '?e=f'

    wrapper.setProps(null, () => {
      expect(wrapper.find('WrappedComponent').prop('locationChanged')).toEqual(true)
      done()
    })
  })

  it('should set prop "locationChanged" to true when prop "location.pathname" changed', done => {
    const wrapper = createWrapper()
    expect(wrapper.find('WrappedComponent').prop('locationChanged')).toEqual(false)

    routerProps.location.pathname = '/changed-path'

    wrapper.setProps(null, () => {
      expect(wrapper.find('WrappedComponent').prop('locationChanged')).toEqual(true)
      done()
    })
  })
})
