import React from 'react'
import {mount} from 'enzyme'
import SettingsPage from './SettingsPage'

describe('SettingsPage', () => {

  let state, dispatch

  const createWrapper = () => mount(<SettingsPage state={state} dispatch={dispatch} />)

  const createOptions = () => createWrapper().find('Option')

  beforeEach(() => {
    dispatch = jest.fn()

    state = {
      settings: {
        pageSize: 30,
        showUnseenEntries: true,
        showEntryDetails: false
      }
    }
  })

  it('should create option component for every setting in prop "settings"', () => {
    const options = createOptions()

    expect(options.at(0).props()).toContainObject({
      value: 30,
      options: [10, 20, 30]
    })
    expect(options.at(1).props()).toContainObject({
      value: true,
      options: [{label: 'show', value: false}, {label: 'hide', value: true}]
    })
    expect(options.at(2).props()).toContainObject({
      value: false,
      options: [{label: 'show', value: true}, {label: 'hide', value: false}]
    })
  })

  it('should trigger prop function "onChange" with changed pageSize option', () => {
    const settings = {...state.settings, pageSize: 10}

    createOptions().at(0).props().onSelect(10)
    expect(dispatch).toHaveBeenCalledWith({
      settings,
      type: 'SETTINGS_UPDATE'
    })
  })

  it('should trigger prop function "onChange" with changed showUnseenEntries option', () => {
    const settings = {...state.settings, showUnseenEntries: false}

    createOptions().at(1).props().onSelect(false)
    expect(dispatch).toHaveBeenCalledWith({
      settings,
      type: 'SETTINGS_UPDATE'
    })
  })

  it('should trigger prop function "onChange" with changed showEntryDetails option', () => {
    const settings = {...state.settings, showEntryDetails: true}

    createOptions().at(2).props().onSelect(true)
    expect(dispatch).toHaveBeenCalledWith({
      settings,
      type: 'SETTINGS_UPDATE'
    })
  })

  it('should contain subscription tags component', () => {
    expect(createWrapper().find('SubscriptionTags').exists()).toEqual(true)
  })
})
