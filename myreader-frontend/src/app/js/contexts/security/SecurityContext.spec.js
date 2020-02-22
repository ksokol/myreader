import React from 'react'
import {mount} from 'enzyme'
import {SecurityProvider} from './SecurityProvider'
import SecurityContext from './SecurityContext'
import {api} from '../../api'

/* eslint-disable react/prop-types */
jest.mock('../../api', () => ({
  api: {
    addInterceptor: jest.fn(),
    removeInterceptor: jest.fn()
  }
}))
/* eslint-enable */

class TestComponent extends React.Component {
  static contextType = SecurityContext
  render = () => 'expected component'
}

const STORAGE_KEY = 'myreader-security'

describe('security context', () => {

  const createWrapper = () => {
    return mount(
      <SecurityProvider>
        <TestComponent />
      </SecurityProvider>
    )
  }

  beforeEach(() => {
    api.addInterceptor.mockClear()
    localStorage.clear()
    localStorage.setItem(STORAGE_KEY, '{"roles": ["ADMIN", "USER"]}')
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('should render children', () => {
    expect(createWrapper().find(TestComponent).html()).toEqual('expected component')
  })

  it('should contain expected context values in child component', () => {
    expect(createWrapper().find(TestComponent).instance().context).toEqual(expect.objectContaining({
      isAdmin: true,
      authorized: true,
      roles: ['ADMIN', 'USER']
    }))
  })

  it('should set prop "isAdmin" to false and prop "roles" when "doAuthorize" triggered', () => {
    const wrapper = createWrapper()
    wrapper.find(TestComponent).instance().context.doAuthorize(['SOME_ROLE'])

    expect(wrapper.find(TestComponent).instance().context).toEqual(expect.objectContaining({
      isAdmin: false,
      authorized: true,
      roles: ['SOME_ROLE']
    }))
  })

  it('should persist roles to local storage when "doAuthorize" triggered', () => {
    createWrapper().find(TestComponent).instance().context.doAuthorize(['SOME_ROLE'])

    expect(JSON.parse(localStorage.getItem('myreader-security'))).toEqual({
      roles: ['SOME_ROLE']
    })
  })

  it('should set prop "isAdmin" to false and prop "roles" to empty array when "doUnAuthorize" triggered', () => {
    const wrapper = createWrapper()
    wrapper.find(TestComponent).instance().context.doUnAuthorize()

    expect(wrapper.find(TestComponent).instance().context).toEqual(expect.objectContaining({
      isAdmin: false,
      authorized: false,
      roles: []
    }))
  })

  it('should clear roles from local storage when "doUnAuthorize" triggered', () => {
    createWrapper().find(TestComponent).instance().context.doUnAuthorize()

    expect(JSON.parse(localStorage.getItem('myreader-security'))).toEqual({
      roles: []
    })
  })

  it('should set prop "isAdmin" to false and prop "roles" to empty array when status is 401', () => {
    const wrapper = createWrapper()

    api.addInterceptor.mock.calls[0][0].onError(null, {status: 401})

    expect(wrapper.find(TestComponent).instance().context).toEqual(expect.objectContaining({
      isAdmin: false,
      authorized: false,
      roles: []
    }))
  })

  it('should not change props when status is 200', () => {
    const wrapper = createWrapper()

    api.addInterceptor.mock.calls[0][0].onError(null, {status: 200})

    expect(wrapper.find(TestComponent).instance().context).toEqual(expect.objectContaining({
      isAdmin: true,
      authorized: true,
      roles: ['ADMIN', 'USER']
    }))
  })

  it('should remove component from api interceptors on unmount', () => {
    const wrapper = createWrapper()
    const instance = wrapper.instance()
    wrapper.unmount()

    expect(api.removeInterceptor).toHaveBeenCalledWith(instance)
  })
})
