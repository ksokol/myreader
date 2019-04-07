import React from 'react'
import {mount} from 'enzyme'
import SettingsPageContainer from './SettingsPageContainer'

/* eslint-disable react/prop-types */
jest.mock('../../pages', () => ({
  SettingsPage: () => null
}))
/* eslint-enable */

describe('SettingsPageContainer', () => {

  let state, dispatch

  const createWrapper = () => {
    return mount(<SettingsPageContainer dispatch={dispatch} {...state} />).find('SettingsPage')
  }

  beforeEach(() => {
    dispatch = jest.fn()

    state = {
      settings: {
        pageSize: 20,
        showUnseenEntries: false,
        showEntryDetails: true
      }
    }
  })

  it('should initialize settings component with given settings', () => {
    expect(createWrapper().prop('settings')).toEqual({
      pageSize: 20,
      showUnseenEntries: false,
      showEntryDetails: true
    })
  })

  it('should dispatch action with given settings', () => {
    const wrapper = createWrapper()

    wrapper.props().onChange({
      pageSize: 10,
      showUnseenEntries: true,
      showEntryDetails: false
    })

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SETTINGS_UPDATE',
      settings: {
        pageSize: 10,
        showUnseenEntries: true,
        showEntryDetails: false
      }
    })
  })
})
