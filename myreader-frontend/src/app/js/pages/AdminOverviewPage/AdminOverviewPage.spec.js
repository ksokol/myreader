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
    rebuildSearchIndex: jest.fn().mockResolvedValue({})
  }
}))
/* eslint-enable */

describe('AdminOverviewPage', () => {

  let state, dispatch, props

  const createWrapper = () => mount(<AdminOverviewPage {...props} dispatch={dispatch} state={state} />)

  beforeEach(() => {
    dispatch = jest.fn()

    state = {
      admin: {
        applicationInfo: {
          branch: 'expected branch',
          commitId: 'expected commitId',
          version: 'expected version',
          buildTime: 'expected buildTime',
        }
      }
    }

    props = {
      showSuccessNotification: jest.fn(),
      showErrorNotification: jest.fn()
    }
  })

  it('should trigger action GET_APPLICATION_INFO when mounted', () => {
    createWrapper()

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'GET_APPLICATION_INFO'
    }))
  })

  it('should render application info component when prop "applicationInfo" is present', () => {
    expect(createWrapper().find('AdminOverview').prop('applicationInfo')).toEqual({
      branch: 'expected branch',
      commitId: 'expected commitId',
      version: 'expected version',
      buildTime: 'expected buildTime',
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
    adminApi.rebuildSearchIndex = jest.fn().mockRejectedValue('expected error')
    await createWrapper().find('AdminOverview').props().rebuildSearchIndex()

    expect(props.showErrorNotification).toHaveBeenCalledWith('expected error')
  })
})
