import React from 'react'
import {mount} from 'enzyme'
import LogoutPage from './LogoutPage'
import {LOGIN_URL} from '../../constants'

describe('LogoutPage', () => {

  let dispatch

  const createWrapper = () => mount(<LogoutPage dispatch={dispatch} />)

  beforeEach(() => {
    dispatch = jest.fn().mockImplementation(dispatch)
  })

  it('should not redirect to login page when api call is pending', () => {
    expect(createWrapper().find('Redirect').exists()).toEqual(false)
  })

  it('should dispatch action POST_LOGOUT on mount', () => {
    createWrapper()

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'POST_LOGOUT',
      url: 'logout'
    }))
  })

  it('should redirect to login page when logout api call finished', () => {
    const wrapper = createWrapper()

    dispatch.mock.calls[0][0].finalize()
    wrapper.update()

    expect(wrapper.find('Redirect').prop('to')).toEqual(LOGIN_URL)
  })

  it('should reset security context when logout api call finished', () => {
    createWrapper()

    dispatch.mock.calls[0][0].finalize()

    expect(dispatch.mock.calls[0][0].finalize()).toEqual(expect.objectContaining({
      type: 'SECURITY_UPDATE',
      roles: []
    }))
  })
})
