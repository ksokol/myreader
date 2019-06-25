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

describe('app context', () => {

  let mediaMatchListeners

  beforeEach(() => {
    mediaMatchListeners = []

    window.matchMedia = media => ({
      media,
      addListener: fn => mediaMatchListeners.push(() => fn({matches: true, media}))
    })
  })

  const createWrapperFor = Component => {
    const wrapper = mount(
      <AppContextProvider>
        <Component />
      </AppContextProvider>
    )

    mediaMatchListeners[1]()
    wrapper.update()

    return wrapper
  }

  it('with hoc should contain expected context values', () => {
    const wrapper = createWrapperFor(withAppContext(props => JSON.stringify(props)))

    expect(wrapper.html()).toEqual(
      '{"mediaBreakpoint":"tablet","pageSize":5,"showUnseenEntries":true,"showEntryDetails":false}'
    )
  })

  it('with hook should contain expected context values', () => {
    const wrapper = createWrapperFor(() => JSON.stringify(useAppContext()))

    expect(wrapper.html()).toEqual(
      '{"mediaBreakpoint":"tablet","pageSize":5,"showUnseenEntries":true,"showEntryDetails":false}'
    )
  })
})
