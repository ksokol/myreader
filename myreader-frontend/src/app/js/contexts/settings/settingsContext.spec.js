import React from 'react'
import {mount} from 'enzyme'
import {SettingsProvider} from './SettingsProvider'
import {useSettings} from '.'

const storageKey = 'myreader-settings'

function TestComponent() {
  return JSON.stringify(useSettings())
}

describe('settings context', () => {

  const storedValues = {
    pageSize: 20,
    showUnseenEntries: false,
    showEntryDetails: false,
  }

  const createWrapper = () => {
    return mount(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    )
  }

  beforeEach(() => {
    localStorage.setItem(storageKey, JSON.stringify(storedValues))
  })

  it('should contain expected context values in child component', () => {
    expect(createWrapper().html()).toEqual(JSON.stringify({
      ...storedValues,
      pageSize: 20,
    }))
  })

  it('should trigger setPageSize function in settings context provider', () => {
    const value = 30
    const wrapper = createWrapper()

    wrapper.instance().setPageSize(value)
    wrapper.update()

    const expectedValues = JSON.stringify({
      ...storedValues,
      pageSize: value,
    })

    expect(localStorage.getItem(storageKey)).toEqual(expectedValues)
    expect(wrapper.html()).toEqual(expectedValues)
  })

  it('should trigger setShowEntryDetails function in settings context provider', () => {
    const value = true
    const wrapper = createWrapper()

    wrapper.instance().setShowEntryDetails(value)
    wrapper.update()

    const expectedValues = JSON.stringify({
      ...storedValues,
      showEntryDetails: value,
    })

    expect(localStorage.getItem(storageKey)).toEqual(expectedValues)
    expect(wrapper.html()).toEqual(expectedValues)
  })

  it('should trigger setShowUnseenEntries function in settings context provider', () => {
    const value = true
    const wrapper = createWrapper()

    wrapper.instance().setShowUnseenEntries(value)
    wrapper.update()

    const expectedValues = JSON.stringify({
      ...storedValues,
      showUnseenEntries: value,
    })

    expect(localStorage.getItem(storageKey)).toEqual(expectedValues)
    expect(wrapper.html()).toEqual(expectedValues)
  })
})
