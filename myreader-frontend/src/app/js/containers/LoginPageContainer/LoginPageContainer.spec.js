import React from 'react'
import {mount} from 'enzyme'
import LoginPageContainer from './LoginPageContainer'

/* eslint-disable react/prop-types */
jest.mock('../../pages', () => ({
  LoginPage: () => null
}))
/* eslint-enable */

describe('LoginPageContainer', () => {

  let state, dispatch

  const createWrapper = () => {
    return mount(<LoginPageContainer dispatch={dispatch} {...state} />).find('LoginPage')
  }

  beforeEach(() => {
    dispatch = jest.fn()

    state = {
      security: {
        roles: ['expected role'],
        loginForm: {
          loginPending: true,
          loginFailed: true
        }
      }
    }
  })

  it('should initialize component with given props', () => {
    expect(createWrapper().props()).toContainObject({
      roles: ['expected role'],
      loginPending: true,
      loginFailed: true
    })
  })

  it('should dispatch expected action when prop function "onLogin" triggered', () => {
    createWrapper().props().onLogin({username: 'expected-username', password: 'expected-password'})

    expect(dispatch.mock.calls[0][0].type).toEqual('POST_LOGIN')
    expect(dispatch.mock.calls[0][0].body.toString()).toEqual('username=expected-username&password=expected-password')
  })
})
