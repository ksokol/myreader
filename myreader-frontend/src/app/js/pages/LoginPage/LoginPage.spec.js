import React from 'react'
import {mount} from 'enzyme'
import LoginPage from './LoginPage'
import {authenticationApi} from '../../api'
import {flushPromises, rejected, resolved} from '../../shared/test-utils'

/* eslint-disable react/prop-types */
jest.mock('../../components', () => ({
  LoginForm: () => null
}))

jest.mock('../../api', () => ({
  authenticationApi: {}
}))

jest.mock('../../contexts/locationState/withLocationState', () => ({
  withLocationState: Component => Component
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
    props = {
      authorized: false,
      doAuthorize: jest.fn()
    }
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

    wrapper.find('LoginForm').props().onLogin({
      username: 'expected-username',
      password: 'expected-password'
    })

    expect(authenticationApi.login).toHaveBeenCalledWith('expected-username', 'expected-password')
  })

  it('should not redirect to entries page when user is not authorized', async () => {
    const wrapper = await createWrapper()

    expect(wrapper.find('Redirect').exists()).toEqual(false)
  })

  it('should redirect to entries page when user is authorized', async () => {
    props.authorized = true

    const wrapper = await createWrapper()

    expect(wrapper.find('Redirect').prop('to')).toEqual('/app/entries')
  })

  it('should set prop "loginPending" to true when prop function "onLogin" called', async () => {
    const wrapper = await createWrapper()
    wrapper.find('LoginForm').props().onLogin({})
    wrapper.update()

    expect(wrapper.find('LoginForm').props()).toEqual(expect.objectContaining({
      loginPending: true,
      loginFailed: false
    }))
  })

  it('should set prop "loginPending" to false when authenticationApi.login succeeded', async () => {
    const wrapper = await createWrapper()
    wrapper.find('LoginForm').props().onLogin({})
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('LoginForm').props()).toEqual(expect.objectContaining({
      loginPending: false,
      loginFailed: false
    }))
  })

  it('should not set prop "loginFailed" to true when authenticationApi.login succeeded', async () => {
    const wrapper = await createWrapper()
    authenticationApi.login = rejected()
    wrapper.find('LoginForm').props().onLogin({})
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('LoginForm').props()).toEqual(expect.objectContaining({
      loginPending: false,
      loginFailed: true
    }))
  })

  it('should set prop "loginFailed" to true when authenticationApi.login failed', async () => {
    const wrapper = await createWrapper()
    authenticationApi.login = rejected()
    wrapper.find('LoginForm').props().onLogin({})
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('LoginForm').props()).toEqual(expect.objectContaining({
      loginPending: false,
      loginFailed: true
    }))
  })

  it('should trigger prop function "doAuthorize" when login succeeded', async () => {
    const wrapper = await createWrapper()
    wrapper.find('LoginForm').props().onLogin({})
    await flushPromises()
    wrapper.update()

    expect(props.doAuthorize).toHaveBeenCalledWith(['USER'])
  })
})
