import React from 'react'
import {mount} from 'enzyme'
import MaintenancePage from './MaintenancePage'

describe('MaintenancePage', () => {

  let state, dispatch

  const createWrapper = () => mount(<MaintenancePage dispatch={dispatch} state={state} />)

  beforeEach(() => {
    dispatch = jest.fn()

    state = {
      admin: {
        applicationInfo: undefined
      }
    }
  })

  it('should trigger action GET_APPLICATION_INFO when mounted', () => {
    createWrapper()

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'GET_APPLICATION_INFO'
    }))
  })

  it('should trigger action PUT_INDEX_SYNC_JOB when button clicked', () => {
    createWrapper().find('Button').props().onClick()

    expect(dispatch).toHaveBeenNthCalledWith(2, expect.objectContaining({
      type: 'PUT_INDEX_SYNC_JOB'
    }))
  })

  it('should not render application info component when prop "applicationInfo" is undefined', () => {
    createWrapper()

    expect(createWrapper().find('ApplicationInfo').exists()).toEqual(false)
  })

  it('should not render application info component when prop "applicationInfo" is an empty object', () => {
    state.admin.applicationInfo = {}

    expect(createWrapper().find('ApplicationInfo').exists()).toEqual(false)
  })

  it('should render application info component when prop "applicationInfo" is present', () => {
    state.admin.applicationInfo = {
      branch: 'expected branch',
      commitId: 'expected commitId',
      version: 'expected version',
      buildTime: 'expected buildTime',
    }

    expect(createWrapper().find('ApplicationInfo').props()).toEqual({
      branch: 'expected branch',
      commitId: 'expected commitId',
      version: 'expected version',
      buildTime: 'expected buildTime',
    })
  })
})
