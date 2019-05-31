import React from 'react'
import {mount} from 'enzyme'
import MaintenancePage from './MaintenancePage'

/* eslint-disable react/prop-types */
jest.mock('../../components', () => ({
  AdminOverview: () => null
}))
/* eslint-enable */

describe('MaintenancePage', () => {

  let state, dispatch

  const createWrapper = () => mount(<MaintenancePage dispatch={dispatch} state={state} />)

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
  })

  it('should trigger action GET_APPLICATION_INFO when mounted', () => {
    createWrapper()

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'GET_APPLICATION_INFO'
    }))
  })

  it('should trigger action PUT_INDEX_SYNC_JOB when prop function "rebuildSearchIndex" triggered', () => {
    createWrapper().find('AdminOverview').props().rebuildSearchIndex()

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'PUT_INDEX_SYNC_JOB'
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
})
