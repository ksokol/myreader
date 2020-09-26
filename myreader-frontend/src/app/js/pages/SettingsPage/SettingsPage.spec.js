import React from 'react'
import {mount} from 'enzyme'
import {SettingsPage} from './SettingsPage'
import {useSettings} from '../../contexts/settings'

/* eslint-disable react/prop-types */
jest.mock('../../contexts/settings', () => ({
  useSettings: jest.fn()
}))

jest.mock('../../components/SubscriptionTags/SubscriptionTags', () => ({
  SubscriptionTags: () => null
}))
/* eslint-enable */

describe('SettingsPage', () => {

  let setPageSize, setShowEntryDetails, setShowUnseenEntries

  const createWrapper = () => mount(<SettingsPage />)

  beforeEach(() => {
    setPageSize = jest.fn()
    setShowEntryDetails = jest.fn()
    setShowUnseenEntries = jest.fn()

    useSettings.mockReturnValue({
      pageSize: 30,
      showUnseenEntries: true,
      showEntryDetails: false,
      setPageSize,
      setShowEntryDetails,
      setShowUnseenEntries
    })
  })

  it('should create option component for every setting', () => {
    const options = createWrapper().find('Option')

    expect(options.at(0).props()).toEqual(expect.objectContaining({
      value: 30,
      options: [10, 20, 30]
    }))
    expect(options.at(1).props()).toEqual(expect.objectContaining({
      value: true,
      options: [{label: 'show', value: false}, {label: 'hide', value: true}]
    }))
    expect(options.at(2).props()).toEqual(expect.objectContaining({
      value: false,
      options: [{label: 'show', value: true}, {label: 'hide', value: false}]
    }))
  })

  it('should trigger setPageSize with changed pageSize option', () => {
    createWrapper().find('Option').at(0).props().onSelect(10)
    expect(setPageSize).toHaveBeenCalledWith(10)
  })

  it('should trigger setShowEntryDetails with changed showUnseenEntries option', () => {
    createWrapper().find('Option').at(2).props().onSelect(false)
    expect(setShowEntryDetails).toHaveBeenCalledWith(false)
  })

  it('should trigger setShowUnseenEntries with changed showEntryDetails option', () => {
    createWrapper().find('Option').at(1).props().onSelect(true)
    expect(setShowUnseenEntries).toHaveBeenCalledWith(true)
  })

  it('should contain subscription tags component', () => {
    expect(createWrapper().find('SubscriptionTags').exists()).toEqual(true)
  })
})
