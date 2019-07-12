import React from 'react'
import {mount} from 'enzyme'
import LogoutPage from './LogoutPage'
import {LOGIN_URL} from '../../constants'
import {authenticationApi} from '../../api'
import {toast} from '../../components/Toast'
import {flushPromises, pending, rejected, resolved} from '../../shared/test-utils'

/* eslint-disable react/prop-types */
jest.mock('../../contexts/locationState/withLocationState', () => ({
  withLocationState: Component => Component
}))

jest.mock('../../api', () => ({
  authenticationApi: {}
}))

jest.mock('../../components/Toast', () => ({
  toast: jest.fn()
}))
/* eslint-enable */

describe('LogoutPage', () => {

  let dispatch, props

  const createWrapper = async (onMount = resolved()) => {
    authenticationApi.logout = onMount
    const wrapper = mount(<LogoutPage {...props} dispatch={dispatch} />)
    await flushPromises()
    wrapper.update()
    return wrapper
  }

  beforeEach(() => {
    dispatch = jest.fn().mockImplementation(dispatch)
    toast.mockClear()

    props = {
      historyGoBack: jest.fn()
    }
  })

  it('should not redirect to login page when authenticationApi.logout is pending', async () => {
    const wrapper = await createWrapper(pending())
    expect(wrapper.find('Redirect').exists()).toEqual(false)
  })

  it('should redirect to login page when authenticationApi.logout succeeded', async () => {
    const wrapper = await createWrapper()

    expect(wrapper.find('Redirect').prop('to')).toEqual(LOGIN_URL)
  })

  it('should reset security context when authenticationApi.logout succeeded', async () => {
    await createWrapper()

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'SECURITY_UPDATE',
      roles: []
    }))
  })

  it('should not trigger toast when authenticationApi.logout succeeded', async () => {
    await createWrapper()

    expect(toast).not.toHaveBeenCalled()
  })

  it('should not trigger prop function "historyGoBack" when authenticationApi.logout succeeded', async () => {
    await createWrapper()

    expect(props.historyGoBack).not.toHaveBeenCalled()
  })

  it('should trigger toast when authenticationApi.logout failed', async () => {
    await createWrapper(rejected('some error'))

    expect(toast).toHaveBeenCalledWith('Logout failed', {error: true})
  })

  it('should trigger prop function "historyGoBack" when authenticationApi.logout failed', async () => {
    await createWrapper(rejected())

    expect(props.historyGoBack).toHaveBeenCalled()
  })
})
