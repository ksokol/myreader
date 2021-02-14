import React from 'react'
import {mount} from 'enzyme'
import {SettingsPage} from './SettingsPage'
import {useSettings} from '../../contexts/settings'

/* eslint-disable react/prop-types */
jest.mock('../../contexts/settings', () => ({
  useSettings: jest.fn()
}))
/* eslint-enable */

describe('SettingsPage', () => {

  let setShowEntryDetails, setShowUnseenEntries

  const createWrapper = () => mount(<SettingsPage />)

  beforeEach(() => {
    setShowEntryDetails = jest.fn()
    setShowUnseenEntries = jest.fn()

    useSettings.mockReturnValue({
      showUnseenEntries: true,
      showEntryDetails: false,
      setShowEntryDetails,
      setShowUnseenEntries
    })
  })

  it('should create option component for every setting', () => {
    const options = createWrapper().find('Option')

    expect(options.at(0).props()).toEqual(expect.objectContaining({
      value: true,
      options: [{label: 'show', value: false}, {label: 'hide', value: true}]
    }))
    expect(options.at(1).props()).toEqual(expect.objectContaining({
      value: false,
      options: [{label: 'show', value: true}, {label: 'hide', value: false}]
    }))
  })

  it('should trigger setShowEntryDetails with changed showUnseenEntries option', () => {
    createWrapper().find('Option').at(1).props().onSelect(false)
    expect(setShowEntryDetails).toHaveBeenCalledWith(false)
  })

  it('should trigger setShowUnseenEntries with changed showEntryDetails option', () => {
    createWrapper().find('Option').at(0).props().onSelect(true)
    expect(setShowUnseenEntries).toHaveBeenCalledWith(true)
  })
})
