import React from 'react'
import {mount} from 'enzyme'
import LoginForm from './LoginForm'

describe('LoginForm', () => {

  let props

  const createWrapper = () => mount(<LoginForm {...props} />)

  beforeEach(() => {
    props = {
      onLogin: jest.fn()
    }
  })

  it('should pass expected props to email input component', () => {
    expect(createWrapper().find('Input[type="email"]').props()).toEqual(expect.objectContaining({
      name: 'username',
      label: 'Email',
      value: '',
      autoComplete: 'email',
      disabled: false
    }))
  })

  it('should update email input prop "value" when input changed', () => {
    const wrapper = createWrapper()
    wrapper.find('Input[type="email"]').props().onChange({target: {value: 'expected username'}})
    wrapper.update()
    
    expect(wrapper.find('Input[type="email"]').prop('value')).toEqual('expected username')
  })

  it('should pass expected props to password input component', () => {
    expect(createWrapper().find('Input[type="password"]').props()).toEqual(expect.objectContaining({
      name: 'password',
      label: 'Password',
      value: '',
      autoComplete: 'current-password',
      disabled: false
    }))
  })

  it('should update password input prop "value" when input changed', () => {
    const wrapper = createWrapper()
    wrapper.find('Input[type="password"]').props().onChange({target: {value: 'expected password'}})
    wrapper.update()

    expect(wrapper.find('Input[type="password"]').prop('value')).toEqual('expected password')
  })

  it('should pass expected props to login button component', () => {
    expect(createWrapper().find('Button').prop('disabled')).toEqual(false)
  })

  it('should trigger prop function "onLogin" if form submitted', () => {
    const wrapper = createWrapper()
    wrapper.find('Input[type="email"]').props().onChange({target: {value: 'expected username'}})
    wrapper.find('Input[type="password"]').props().onChange({target: {value: 'expected password'}})
    wrapper.find('form').simulate('submit')

    expect(props.onLogin).toHaveBeenCalledWith({
      username: 'expected username',
      password: 'expected password'
    })
  })

  it('should disable inputs and login button when prop "loginPending" is set to true', () => {
    props.loginPending = true
    const wrapper = createWrapper()

    expect(wrapper.find('Input[type="email"]').prop('disabled')).toEqual(true)
    expect(wrapper.find('Input[type="password"]').prop('disabled')).toEqual(true)
    expect(wrapper.find('Button').prop('disabled')).toEqual(true)
  })

  it('should not render login error message when prop "loginFailed" is undefined', () => {
    expect(createWrapper().find('.my-login-form__message').children().exists()).toEqual(false)
  })

  it('should render login error message when prop "loginFailed" is set to true', () => {
    props.loginFailed = true

    expect(createWrapper().find('.my-login-form__message').children().exists()).toEqual(true)
  })
})
