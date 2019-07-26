import React from 'react'
import {mount} from 'enzyme'
import {AppContextProvider, useAppContext, withAppContext} from '.'
import {Provider} from 'react-redux'
import {createMockStore} from '../shared/test-utils'

/* eslint-disable react/prop-types */
jest.mock('./settings/settings', () => ({
  settings: () => ({
    pageSize: 5,
    showUnseenEntries: true,
    showEntryDetails: false
  })

}))
/* eslint-enable */

describe('app context', () => {

  let expectedResult, mediaMatchListeners, store

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
      pageSize: 5,
      showUnseenEntries: true,
      showEntryDetails: false,
      hotkeysStamp: 2,
      hotkey: 'ArrowLeft',
      authorized: true,
      isAdmin: true,
      roles: ['USER', 'ADMIN']
    })

    store = createMockStore()
    store.setState({
      security: {
        roles: ['USER', 'ADMIN']
      }
    })
  })

  const createWrapperFor = Component => {
    const wrapper = mount(
      <Provider store={store}>
        <AppContextProvider>
          <Component />
        </AppContextProvider>
      </Provider>
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
