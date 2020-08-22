import React from 'react'
import {act} from 'react-dom/test-utils'
import {useHistory} from 'react-router-dom'
import {mount} from 'enzyme'
import {LogoutPage} from './LogoutPage'
import {LOGIN_URL} from '../../constants'
import {authenticationApi} from '../../api'
import {toast} from '../../components/Toast'
import {flushPromises, pending, rejected, resolved} from '../../shared/test-utils'
import {useSecurity} from '../../contexts/security'

/* eslint-disable react/prop-types */
jest.mock('../../contexts/security', () => {
  const doUnAuthorize = jest.fn()
  return {
    useSecurity: () => ({
      doUnAuthorize
    })
  }
})

jest.mock('../../api', () => ({
  authenticationApi: {}
}))

jest.mock('../../components/Toast', () => ({
  toast: jest.fn()
}))
/* eslint-enable */

describe('LogoutPage', () => {

  let props

  const createWrapper = async (onMount = resolved()) => {
    authenticationApi.logout = onMount
    const wrapper = mount(<LogoutPage {...props} />)
    await flushPromises()
    act(() => {
      wrapper.update()
    })
    return wrapper
  }

  beforeEach(() => {
    toast.mockClear()

    props = {
      doUnAuthorize: jest.fn(),
    }
  })

  it('should not redirect to login page when authenticationApi.logout is pending', async () => {
    const wrapper = await createWrapper(pending())
    expect(wrapper.find('Redirect').exists()).toEqual(false)
  })

  it('should redirect to login page when authenticationApi.logout succeeded', async () => {
    let wrapper

    await act(async () => {
      wrapper = await createWrapper()
    })
    wrapper.mount()

    expect(wrapper.find('Redirect').prop('to')).toEqual(LOGIN_URL)
  })

  it('should trigger prop function "doUnAuthorize" when authenticationApi.logout succeeded', async () => {
    await act(async () => {
      await createWrapper()
    })

    expect(useSecurity().doUnAuthorize).toHaveBeenCalled()
  })

  it('should not trigger prop function "doUnAuthorize" when authenticationApi.logout failed', async () => {
    await createWrapper(rejected('some error'))

    expect(props.doUnAuthorize).not.toHaveBeenCalled()
  })

  it('should not trigger toast when authenticationApi.logout succeeded', async () => {
    await act(async () => {
      await createWrapper()
    })

    expect(toast).not.toHaveBeenCalled()
  })

  it('should not trigger history.goBack when authenticationApi.logout succeeded', async () => {
    await act(async () => {
      await createWrapper()
    })

    expect(useHistory().goBack).not.toHaveBeenCalled()
  })

  it('should trigger toast when authenticationApi.logout failed', async () => {
    await createWrapper(rejected('some error'))

    expect(toast).toHaveBeenCalledWith('Logout failed', {error: true})
  })

  it('should trigger history.goBack when authenticationApi.logout failed', async () => {
    await createWrapper(rejected())

    expect(useHistory().goBack).toHaveBeenCalled()
  })
})
