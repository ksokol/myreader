import React from 'react'
import {shallow} from 'enzyme'
import LoginPage from './LoginPage'
import {Button} from '../../components'

describe('LoginPage', () => {

  let props

  const createComponent = () => shallow(<LoginPage {...props} />)

  beforeEach(() => {
    props = {
      onLogin: jest.fn()
    }
  })

  it('should pass expected props to email input component', () => {
    expect(createComponent().find('[type="email"]').props()).toContainObject({
      name: 'username',
      label: 'Email',
      value: '',
      autoComplete: 'email',
      disabled: false
    })
  })

  it('should update email input prop "value" when input changed', () => {
    const wrapper = createComponent()
    wrapper.find('[type="email"]').props().onChange('expected username')

    expect(wrapper.find('[type="email"]').prop('value')).toEqual('expected username')
  })

  it('should pass expected props to password input component', () => {
    expect(createComponent().find('[type="password"]').props()).toContainObject({
      name: 'password',
      label: 'Password',
      value: '',
      autoComplete: 'current-password',
      disabled: false
    })
  })

  it('should update password input prop "value" when input changed', () => {
    const wrapper = createComponent()
    wrapper.find('[type="password"]').props().onChange('expected password')

    expect(wrapper.find('[type="password"]').prop('value')).toEqual('expected password')
  })

  it('should pass expected props to login button component', () => {
    expect(createComponent().find(Button).props()).toContainObject({
      type: 'submit',
      disabled: false
    })
  })

  it('should trigger prop function "onLogin" when login button clicked', () => {
    const wrapper = createComponent()
    wrapper.find('[type="email"]').props().onChange('expected username')
    wrapper.find('[type="password"]').props().onChange('expected password')
    wrapper.find(Button).props().onClick()

    expect(props.onLogin).toHaveBeenCalledWith({
      username: 'expected username',
      password: 'expected password'
    })
  })

  it('should disable inputs and login button when prop "disabled" is set to true', () => {
    props.disabled = true
    const wrapper = createComponent()

    expect(wrapper.find('[type="email"]').prop('disabled')).toEqual(true)
    expect(wrapper.find('[type="password"]').prop('disabled')).toEqual(true)
    expect(wrapper.find(Button).prop('disabled')).toEqual(true)
  })

  it('should not render login error message when prop "loginError" is undefined', () => {
    expect(createComponent().find('[className="my-login__message"]').children().exists()).toEqual(false)
  })

  it('should render login error message when prop "loginError" is set to true', () => {
    props.loginError = true

    expect(createComponent().find('[className="my-login__message"]').children().exists()).toEqual(true)
  })
})
