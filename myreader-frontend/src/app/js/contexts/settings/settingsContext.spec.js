import React from 'react'
import {mount} from 'enzyme'
import {SettingsProvider} from './SettingsProvider'
import SettingsContext from './SettingsContext'
import {setPageSize, setShowEntryDetails, setShowUnseenEntries} from './settings'

/* eslint-disable react/prop-types */
jest.mock('./settings', () => ({
  settings: () => ({
    pageSize: 'page size value',
    showUnseenEntries: 'unseen entries value',
    showEntryDetails: 'entry details value'
  }),
  setPageSize: jest.fn(),
  setShowEntryDetails: jest.fn(),
  setShowUnseenEntries: jest.fn()

}))
/* eslint-enable */

class TestComponent extends React.Component {
  static contextType = SettingsContext
  render = () => 'expected component'
}

describe('settings context', () => {

  const createWrapper = () => {
    return mount(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    ).find(TestComponent)
  }

  it('should render children', () => {
    expect(createWrapper().html()).toEqual('expected component')
  })

  it('should contain expected context values in child component', () => {
    expect(createWrapper().instance().context).toEqual(expect.objectContaining({
      pageSize: 'page size value',
      showUnseenEntries: 'unseen entries value',
      showEntryDetails: 'entry details value'
    }))
  })

  it('should trigger setPageSize function in settings context provider', () => {
    const value = 'new page size value'
    const wrapper = createWrapper()
    wrapper.instance().context.setPageSize(value)

    expect(wrapper.instance().context.pageSize).toEqual(value)
    expect(setPageSize).toHaveBeenCalledWith(value)
  })

  it('should trigger setShowEntryDetails function in settings context provider', () => {
    const value = 'new unseen entries value'
    const wrapper = createWrapper()
    wrapper.instance().context.setShowEntryDetails(value)

    expect(wrapper.instance().context.showUnseenEntries).toEqual(value)
    expect(setShowEntryDetails).toHaveBeenCalledWith(value)
  })

  it('should trigger setShowUnseenEntries function in settings context provider', () => {
    const value = 'new entry details value'
    const wrapper = createWrapper()
    wrapper.instance().context.setShowUnseenEntries(value)

    expect(wrapper.instance().context.showEntryDetails).toEqual(value)
    expect(setShowUnseenEntries).toHaveBeenCalledWith(value)
  })
})
