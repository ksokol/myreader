import React from 'react'
import {act} from 'react-dom/test-utils'
import {mount} from 'enzyme'
import {LoginPage} from './LoginPage'
import {authenticationApi} from '../../api'
import {flushPromises, pending, rejected, resolved} from '../../shared/test-utils'
import {useSecurity} from '../../contexts/security'

/* eslint-disable react/prop-types */
jest.mock('../../components', () => ({
  LoginForm: () => null
}))

jest.mock('../../api', () => ({
  authenticationApi: {}
}))

jest.mock('../../contexts/security', () => ({
  useSecurity: jest.fn()
}))
/* eslint-enable */

describe('LoginPage', () => {

  let props

  const createWrapper = async (onMount = resolved({roles: ['USER']})) => {
    authenticationApi.login = onMount
    const wrapper = mount(<LoginPage {...props} />)
    await flushPromises()
    wrapper.update()
    return wrapper
  }

  beforeEach(() => {
    useSecurity.mockReturnValue({
      authorized: false,
      doAuthorize: jest.fn(),
    })
  })

  it('should pass expected props to login form component', async () => {
    const wrapper = await createWrapper()

    expect(wrapper.find('LoginForm').props()).toEqual(expect.objectContaining({
      loginPending: false,
      loginFailed: false
    }))
  })

  it('should call authenticationApi.login with given username and password when prop function "onLogin" called', async () => {
    const wrapper = await createWrapper()

    await act(async () => {
      await wrapper.find('LoginForm').props().onLogin({
        username: 'expected-username',
        password: 'expected-password'
      })
    })

    expect(authenticationApi.login).toHaveBeenCalledWith('expected-username', 'expected-password')
  })

  it('should not redirect to entries page when user is not authorized', async () => {
    const wrapper = await createWrapper()

    expect(wrapper.find('Redirect').exists()).toEqual(false)
  })

  it('should redirect to entries page when user is authorized', async () => {
    useSecurity.mockReturnValue({
      authorized: true
    })

    const wrapper = await createWrapper()

    expect(wrapper.find('Redirect').prop('to')).toEqual('/app/entries')
  })

  it('should set prop "loginPending" to true when prop function "onLogin" called', async () => {
    const wrapper = await createWrapper(pending())
    act(() => {
      wrapper.find('LoginForm').props().onLogin({})
    })
    wrapper.update()

    expect(wrapper.find('LoginForm').props()).toEqual(expect.objectContaining({
      loginPending: true,
      loginFailed: false
    }))
  })

  it('should set prop "loginPending" to false when authenticationApi.login succeeded', async () => {
    const wrapper = await createWrapper()
    await act(async () => {
      await wrapper.find('LoginForm').props().onLogin({})
    })
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('LoginForm').props()).toEqual(expect.objectContaining({
      loginPending: false,
      loginFailed: false
    }))
  })

  it('should not set prop "loginFailed" to true when authenticationApi.login succeeded', async () => {
    const wrapper = await createWrapper(rejected())
    await act(async () => {
      await wrapper.find('LoginForm').props().onLogin({})
    })
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('LoginForm').props()).toEqual(expect.objectContaining({
      loginPending: false,
      loginFailed: true
    }))
  })

  it('should set prop "loginFailed" to true when authenticationApi.login failed', async () => {
    const wrapper = await createWrapper(rejected())
    authenticationApi.login = rejected()
    await act(async () => {
      await wrapper.find('LoginForm').props().onLogin({})
    })
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('LoginForm').props()).toEqual(expect.objectContaining({
      loginPending: false,
      loginFailed: true
    }))
  })

  it('should trigger prop function "doAuthorize" when login succeeded', async () => {
    const doAuthorize = jest.fn()
    useSecurity.mockReturnValue({
      authorized: false,
      doAuthorize,
    })

    const wrapper = await createWrapper()
    act(() => {
      wrapper.find('LoginForm').props().onLogin({})
    })
    await act(async () => {
      await flushPromises()
    })
    wrapper.mount()
    wrapper.update()

    expect(doAuthorize).toHaveBeenCalledWith(['USER'])
  })
})
