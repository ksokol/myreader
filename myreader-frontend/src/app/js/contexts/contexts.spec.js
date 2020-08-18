import React from 'react'
import {mount} from 'enzyme'
import {AppContextProvider, useAppContext, withAppContext} from '.'

/* eslint-disable react/prop-types */
jest.mock('./settings/settings', () => ({
  settings: () => ({
    pageSize: 5,
    showUnseenEntries: true,
    showEntryDetails: false
  })
}))
/* eslint-enable */

const STORAGE_KEY = 'myreader-security'

describe('app context', () => {

  let expectedResult, mediaMatchListeners

  beforeEach(() => {
    mediaMatchListeners = []

    jest.spyOn(Date, 'now')
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(2)

    window.matchMedia = media => ({
      media,
      addListener: fn => mediaMatchListeners.push(() => fn({matches: true, media})),
      removeListener: jest.fn()
    })

    expectedResult = JSON.stringify({
      mediaBreakpoint: 'tablet',
      isDesktop: false,
      pageSize: 5,
      showUnseenEntries: true,
      showEntryDetails: false,
      hotkeysStamp: 1,
      hotkey: 'ArrowLeft',
      authorized: true,
      isAdmin: true,
      roles: ['USER', 'ADMIN']
    })

    localStorage.setItem(STORAGE_KEY, '{"roles": ["USER", "ADMIN"]}')
  })

  const createWrapperFor = Component => {
    const wrapper = mount(
      <AppContextProvider>
        <Component />
      </AppContextProvider>
    )

    mediaMatchListeners[1]()
    document.dispatchEvent(new KeyboardEvent('keyup', {key: 'ArrowLeft'}))
    wrapper.update()

    return wrapper
  }

  it('with hoc should contain expected context values', () => {
    const wrapper = createWrapperFor(withAppContext(props => JSON.stringify(props)))

    expect(wrapper.html()).toEqual(expectedResult)
    wrapper.unmount()
  })

  it('with hook should contain expected context values', () => {
    const wrapper = createWrapperFor(() => JSON.stringify(useAppContext()))

    expect(wrapper.html()).toEqual(expectedResult)
    wrapper.unmount()
  })
})
