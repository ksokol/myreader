import React from 'react'
import {mount} from 'enzyme'
import {Provider} from 'react-redux'
import LoginPageContainer from '../LoginPageContainer/LoginPageContainer'
import {createMockStore} from '../../shared/test-utils'

describe('LoginPageContainer', () => {

  let store

  const createContainer = () => {
    const wrapper = mount(
      <Provider store={store}>
        <LoginPageContainer />
      </Provider>
    )
    return wrapper.find(LoginPageContainer).children().first()
  }

  beforeEach(() => {
    store = createMockStore()
    store.setState({
      security: {
        loginForm: {
          loginPending: true,
          loginFailed: true
        }
      }
    })
  })

  it('should initialize component with given props', () => {
    expect(createContainer().props()).toContainObject({
      loginPending: true,
      loginFailed: true
    })
  })

  it('should dispatch expected action when prop function "onLogin" triggered', () => {
    createContainer().props().onLogin({username: 'expected-username', password: 'expected-password'})

    expect(store.getActionTypes()).toEqual(['POST_LOGIN'])
    expect(store.getActions()[0].body.toString()).toEqual('username=expected-username&password=expected-password')
  })
})
