import React from 'react'
import {mount} from 'enzyme'
import {useAppContext, withAppContext} from '.'
import {MediaBreakpointProvider} from './mediaBreakpoint/MediaBreakpointProvider'
import {SettingsProvider} from './settings/SettingsProvider'

describe('app context', () => {

  let state, mediaMatchListeners

  beforeEach(() => {
    mediaMatchListeners = []

    window.matchMedia = media => ({
      media,
      addListener: fn => mediaMatchListeners.push(() => fn({matches: true, media}))
    })

    state = {
      settings: {
        pageSize: 5,
        showUnseenEntries: true,
        showEntryDetails: false
      }
    }
  })

  const createWrapperFor = Component => {
    const wrapper = mount(
      <SettingsProvider state={state}>
        <MediaBreakpointProvider>
          <Component />
        </MediaBreakpointProvider>
      </SettingsProvider>
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
