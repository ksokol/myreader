import React from 'react'
import {mount} from 'enzyme'
import MaintenancePageContainer from './MaintenancePageContainer'

/* eslint-disable react/prop-types */
jest.mock('../../pages', () => ({
  MaintenancePage: () => null
}))
/* eslint-enable */

describe('MaintenancePageContainer', () => {

  let state, dispatch

  const createWrapper = () => {
    return mount(<MaintenancePageContainer dispatch={dispatch} {...state} />).find('MaintenancePage')
  }

  beforeEach(() => {
    dispatch = jest.fn()

    state = {
      admin: {
        applicationInfo: {
          branch: 'expected branch',
          commitId: 'expected commitId',
          version: 'expected version',
          buildTime: 'expected builtTime'
        }
      }
    }
  })

  it('should dispatch action when prop function "onRefreshIndex" triggered', () => {
    createWrapper().props().onRefreshIndex()

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'PUT_INDEX_SYNC_JOB'
    }))
  })

  it('should initialize maintenance component with given application info', () => {
    expect(createWrapper().prop('applicationInfo')).toEqual({
      branch: 'expected branch',
      commitId: 'expected commitId',
      version: 'expected version',
      buildTime: 'expected builtTime'
    })
  })
})
