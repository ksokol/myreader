import React from 'react'
import {mount} from 'enzyme'
import LoginPage from './LoginPage'

/* eslint-disable react/prop-types */
jest.mock('../../components', () => ({
  LoginForm: () => null
}))
/* eslint-enable */

describe('LoginPage', () => {

  let state, dispatch

  const createWrapper = () => mount(<LoginPage state={state} dispatch={dispatch} />)

  beforeEach(() => {
    dispatch = jest.fn()

    state = {
      security: {
        roles: []
      }
    }
  })

  it('should pass expected props to login form component', () => {
    expect(createWrapper().find('LoginForm').props()).toEqual(expect.objectContaining({
      loginPending: false,
      loginFailed: false
    }))
  })

  it('should dispatch action POST_LOGIN when prop function "onLogin" called', () => {
    createWrapper().find('LoginForm').props().onLogin({
      username: 'expected-username',
      password: 'expected-password'
    })

    expect(dispatch.mock.calls[0][0].type).toEqual('POST_LOGIN')
    expect(dispatch.mock.calls[0][0].body.toString()).toEqual('username=expected-username&password=expected-password')
  })

  it('should not redirect to entries page when user is not authorized', () => {
    expect(createWrapper().find('Redirect').exists()).toEqual(false)
  })

  it('should redirect to entries page when user is authorized', () => {
    state.security.roles = ['USER']

    expect(createWrapper().find('Redirect').prop('to')).toContainObject({
      query: {q: undefined},
      route: ['app', 'entries']
    })
  })

  it('should set prop "loginPending" to true when prop function "onLogin" called', () => {
    const wrapper = createWrapper()
    wrapper.find('LoginForm').props().onLogin({})
    wrapper.update()

    expect(wrapper.find('LoginForm').props()).toEqual(expect.objectContaining({
      loginPending: true,
      loginFailed: false
    }))
  })

  it('should set prop "loginPending" to false when prop function "onLogin" succeeded', () => {
    const wrapper = createWrapper()
    wrapper.find('LoginForm').props().onLogin({})
    wrapper.update()

    dispatch.mock.calls[0][0].success(null, {'x-my-authorities': ''})
    wrapper.update()

    expect(wrapper.find('LoginForm').props()).toEqual(expect.objectContaining({
      loginPending: false,
      loginFailed: false
    }))
  })

  it('should not set prop "loginFailed" to true when login succeeded', () => {
    const wrapper = createWrapper()
    wrapper.find('LoginForm').props().onLogin({})
    wrapper.update()

    dispatch.mock.calls[0][0].finalize(null, null, 200)
    wrapper.update()

    expect(wrapper.find('LoginForm').props()).toEqual(expect.objectContaining({
      loginPending: false,
      loginFailed: false
    }))
  })

  it('should set prop "loginFailed" to true when login failed', () => {
    const wrapper = createWrapper()
    wrapper.find('LoginForm').props().onLogin({})
    wrapper.update()

    dispatch.mock.calls[0][0].finalize(null, null, 401)
    wrapper.update()

    expect(wrapper.find('LoginForm').props()).toEqual(expect.objectContaining({
      loginPending: false,
      loginFailed: true
    }))
  })

  it('should dispatch action SECURITY_UPDATE when login succeeded', () => {
    const wrapper = createWrapper()
    wrapper.find('LoginForm').props().onLogin({})

    const successAction = dispatch.mock.calls[0][0].success(null, {'x-my-authorities': 'USER'})

    expect(successAction).toEqual({
      type: 'SECURITY_UPDATE',
      authorized: true,
      roles: ['USER']
    })
  })
})
