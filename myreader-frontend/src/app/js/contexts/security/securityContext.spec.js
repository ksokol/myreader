import React from 'react'
import {mount} from 'enzyme'
import {SecurityProvider} from './SecurityProvider'
import {api} from '../../api'
import {useSecurity} from '.'

/* eslint-disable react/prop-types */
jest.mock('../../api', () => ({
  api: {
    addInterceptor: jest.fn(),
    removeInterceptor: jest.fn()
  }
}))
/* eslint-enable */

function TestComponent() {
  return JSON.stringify(useSecurity())
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
    localStorage.setItem(STORAGE_KEY, '{"authorized": true}')
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('should contain expected context values in child component', () => {
    expect(createWrapper().html()).toEqual(JSON.stringify({
      authorized: true,
    }))
  })

  it('should persist roles to local storage when "doAuthorize" triggered', () => {
    createWrapper().instance().doAuthorize()

    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual({
      authorized: true
    })
  })

  it('should set prop "isAdmin" to false and prop "roles" to empty array when "doUnAuthorize" triggered', () => {
    const wrapper = createWrapper()
    wrapper.instance().doUnAuthorize()
    wrapper.update()

    expect(wrapper.html()).toEqual(JSON.stringify({
      authorized: false,
    }))
  })

  it('should clear roles from local storage when "doUnAuthorize" triggered', () => {
    createWrapper().instance().doUnAuthorize()

    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual({
      authorized: false,
    })
  })

  it('should set prop "isAdmin" to false and prop "roles" to empty array when status is 401', () => {
    const wrapper = createWrapper()

    api.addInterceptor.mock.calls[0][0].onError(null, {status: 401})
    wrapper.update()

    expect(wrapper.html()).toEqual(JSON.stringify({
      authorized: false,
    }))
  })

  it('should not change props when status is 200', () => {
    const wrapper = createWrapper()

    api.addInterceptor.mock.calls[0][0].onError(null, {status: 200})
    wrapper.update()

    expect(wrapper.html()).toEqual(JSON.stringify({
      authorized: true,
    }))
  })

  it('should remove component from api interceptors on unmount', () => {
    const wrapper = createWrapper()
    const instance = wrapper.instance()
    wrapper.unmount()

    expect(api.removeInterceptor).toHaveBeenCalledWith(instance)
  })
})
