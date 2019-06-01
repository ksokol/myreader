import React from 'react'
import {mount} from 'enzyme'
import AdminOverviewPage from './AdminOverviewPage'
import {adminApi} from '../../api'

/* eslint-disable react/prop-types */
jest.mock('../../components', () => ({
  AdminOverview: () => null
}))

jest.mock('../../contexts', () => ({
  withNotification: Component => Component
}))

jest.mock('../../api', () => ({
  adminApi: {
    rebuildSearchIndex: jest.fn().mockResolvedValue({}),
    fetchApplicationInfo: jest.fn().mockResolvedValue({})
  }
}))
/* eslint-enable */

jest.useRealTimers()

const expectedError = 'expected value'

describe('AdminOverviewPage', () => {

  let props

  const createWrapper = () => mount(<AdminOverviewPage {...props} />)

  beforeEach(() => {
    props = {
      showSuccessNotification: jest.fn(),
      showErrorNotification: jest.fn()
    }
  })

  it('should trigger adminApi.fetchApplicationInfo when mounted', () => {
    createWrapper()

    expect(adminApi.fetchApplicationInfo).toHaveBeenCalled()
  })

  it('should pass applicationInfo to admin overview component when adminApi.fetchApplicationInfo succeeded', done => {
    adminApi.fetchApplicationInfo = jest.fn().mockResolvedValueOnce(expectedError)
    const wrapper = createWrapper()

    setTimeout(() => {
      wrapper.update()
      expect(wrapper.find('AdminOverview').prop('applicationInfo')).toEqual('expected value')
      done()
    })
  })

  it('should trigger prop function  "showErrorNotification" when adminApi.fetchApplicationInfo failed', done => {
    adminApi.fetchApplicationInfo = jest.fn().mockRejectedValueOnce('some error')
    const wrapper = createWrapper()

    setTimeout(() => {
      wrapper.update()
      expect(props.showErrorNotification).toHaveBeenCalledWith('Application info is missing')
      done()
    })
  })

  it('should call adminApi.rebuildSearchIndex when prop function "rebuildSearchIndex" triggered', () => {
    createWrapper().find('AdminOverview').props().rebuildSearchIndex()

    expect(adminApi.rebuildSearchIndex).toHaveBeenCalledWith()
  })

  it('should call prop function "showSuccessNotification" when adminApi.rebuildSearchIndex succeeded', async () => {
    await createWrapper().find('AdminOverview').props().rebuildSearchIndex()

    expect(props.showSuccessNotification).toHaveBeenCalledWith('Indexing started')
  })

  it('should call prop function "showErrorNotification" when adminApi.rebuildSearchIndex failed', async () => {
    adminApi.rebuildSearchIndex = jest.fn().mockRejectedValue(expectedError)
    await createWrapper().find('AdminOverview').props().rebuildSearchIndex()

    expect(props.showErrorNotification).toHaveBeenCalledWith(expectedError)
  })
})
