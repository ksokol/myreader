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
        roles: [],
        loginForm: {
          loginPending: true,
          loginFailed: true
        }
      }
    }
  })

  it('should pass expected props to login form component', () => {
    expect(createWrapper().find('LoginForm').props()).toEqual(expect.objectContaining({
      loginPending: true,
      loginFailed: true
    }))
  })

  it('should dispatch action POST_LOGIN when prop function onLogin called', () => {
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
})
