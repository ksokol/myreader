import React from 'react'
import {mount} from 'enzyme'
import {AdminOverviewPage} from './AdminOverviewPage'
import {adminApi} from '../../api'
import {toast} from '../../components/Toast'
import {flushPromises, pending, rejected, resolved} from '../../shared/test-utils'

/* eslint-disable react/prop-types */
jest.mock('../../components/AdminOverview/AdminOverview', () => ({
  AdminOverview: () => null
}))

jest.mock('../../contexts', () => ({
  withNotification: Component => Component
}))

jest.mock('../../api', () => ({
  adminApi: {}
}))

jest.mock('../../components/Toast', () => ({
  toast: jest.fn()
}))
/* eslint-enable */

jest.useRealTimers()

const expectedError = 'expected value'

describe('AdminOverviewPage', () => {

  const createWrapper = async (onMount = resolved({a: 'b', c: 'd'})) => {
    adminApi.fetchApplicationInfo = onMount
    const wrapper = mount(<AdminOverviewPage />)
    await flushPromises()
    wrapper.update()
    return wrapper
  }

  beforeEach(() => {
    toast.mockClear()
  })

  it('should trigger adminApi.fetchApplicationInfo when mounted', async () => {
    await createWrapper()

    expect(adminApi.fetchApplicationInfo).toHaveBeenCalled()
  })

  it('should pass applicationInfo to admin overview component when adminApi.fetchApplicationInfo succeeded', async () => {
    const wrapper = await createWrapper()

    expect(wrapper.find('AdminOverview').prop('applicationInfo')).toEqual({
      a: 'b',
      c: 'd'
    })
  })

  it('should trigger toast when adminApi.fetchApplicationInfo failed', async () => {
    await createWrapper(rejected('some error'))

    expect(toast).toHaveBeenCalledWith('Application info is missing')
  })

  it('should call adminApi.rebuildSearchIndex when prop function "rebuildSearchIndex" triggered', async () => {
    adminApi.rebuildSearchIndex = pending()
    const wrapper = await createWrapper()
    wrapper.find('AdminOverview').props().rebuildSearchIndex()

    expect(adminApi.rebuildSearchIndex).toHaveBeenCalledWith()
  })

  it('should trigger toast when adminApi.rebuildSearchIndex succeeded', async () => {
    adminApi.rebuildSearchIndex = resolved()
    const wrapper = await createWrapper()
    wrapper.find('AdminOverview').props().rebuildSearchIndex()
    await flushPromises()
    wrapper.update()

    expect(toast).toHaveBeenCalledWith('Indexing started')
  })

  it('should trigger toast when adminApi.rebuildSearchIndex failed', async () => {
    adminApi.rebuildSearchIndex = rejected(expectedError)
    const wrapper = await createWrapper()
    wrapper.find('AdminOverview').props().rebuildSearchIndex()
    await flushPromises()
    wrapper.update()

    expect(toast).toHaveBeenCalledWith(expectedError, {error: true})
  })
})
