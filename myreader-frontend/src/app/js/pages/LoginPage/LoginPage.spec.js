import React from 'react'
import {shallow} from 'enzyme'
import LoginPage from './LoginPage'

/* eslint-disable react/prop-types */
jest.mock('../../components', () => ({
  LoginForm: () => null
}))
/* eslint-enable */

describe('LoginPage', () => {

  let props

  const createWrapper = () => shallow(<LoginPage {...props} />)

  beforeEach(() => {
    props = {
      authorized: false,
      a: 'b',
      c: 'd',
      onLogin: jest.fn()
    }
  })

  it('should pass expected props to login form component', () => {
    expect(createWrapper().find('LoginForm').props()).toEqual({
      a: 'b',
      c: 'd',
      onLogin: props.onLogin
    })
  })

  it('should trigger prop function "onLogin" when login button clicked', () => {
    createWrapper().find('LoginForm').props().onLogin({
      username: 'expected username',
      password: 'expected password'
    })

    expect(props.onLogin).toHaveBeenCalledWith({
      username: 'expected username',
      password: 'expected password'
    })
  })

  it('should not redirect to entries page when user is not authorized', () => {
    expect(createWrapper().find('Redirect').exists()).toEqual(false)
  })

  it('should redirect to entries page when user is authorized', () => {
    props.authorized = true

    expect(createWrapper().find('Redirect').prop('to')).toContainObject({
      query: {q: undefined},
      route: ['app', 'entries']
    })
  })
})
