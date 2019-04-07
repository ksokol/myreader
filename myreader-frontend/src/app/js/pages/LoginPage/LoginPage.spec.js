import React from 'react'
import {shallow} from 'enzyme'
import LoginPage from './LoginPage'

describe('LoginPage', () => {

  let props

  const createWrapper = () => shallow(<LoginPage {...props} />)

  beforeEach(() => {
    props = {
      onLogin: jest.fn()
    }
  })

  it('should pass expected props to email input component', () => {
    expect(createWrapper().find('[type="email"]').props()).toContainObject({
      name: 'username',
      label: 'Email',
      value: '',
      autoComplete: 'email',
      disabled: false
    })
  })

  it('should update email input prop "value" when input changed', () => {
    const wrapper = createWrapper()
    wrapper.find('[type="email"]').props().onChange({target: {value: 'expected username'}})

    expect(wrapper.find('[type="email"]').prop('value')).toEqual('expected username')
  })

  it('should pass expected props to password input component', () => {
    expect(createWrapper().find('[type="password"]').props()).toContainObject({
      name: 'password',
      label: 'Password',
      value: '',
      autoComplete: 'current-password',
      disabled: false
    })
  })

  it('should update password input prop "value" when input changed', () => {
    const wrapper = createWrapper()
    wrapper.find('[type="password"]').props().onChange({target: {value: 'expected password'}})

    expect(wrapper.find('[type="password"]').prop('value')).toEqual('expected password')
  })

  it('should pass expected props to login button component', () => {
    expect(createWrapper().find('Button').props()).toContainObject({
      type: 'submit',
      disabled: false
    })
  })

  it('should trigger prop function "onLogin" when login button clicked', () => {
    const wrapper = createWrapper()
    wrapper.find('[type="email"]').props().onChange({target: {value: 'expected username'}})
    wrapper.find('[type="password"]').props().onChange({target: {value: 'expected password'}})
    wrapper.find('Button').props().onClick()

    expect(props.onLogin).toHaveBeenCalledWith({
      username: 'expected username',
      password: 'expected password'
    })
  })

  it('should disable inputs and login button when prop "loginPending" is set to true', () => {
    props.loginPending = true
    const wrapper = createWrapper()

    expect(wrapper.find('[type="email"]').prop('disabled')).toEqual(true)
    expect(wrapper.find('[type="password"]').prop('disabled')).toEqual(true)
    expect(wrapper.find('Button').prop('disabled')).toEqual(true)
  })

  it('should not render login error message when prop "loginFailed" is undefined', () => {
    expect(createWrapper().find('.my-login-page__message').children().exists()).toEqual(false)
  })

  it('should render login error message when prop "loginFailed" is set to true', () => {
    props.loginFailed = true

    expect(createWrapper().find('.my-login-page__message').children().exists()).toEqual(true)
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
