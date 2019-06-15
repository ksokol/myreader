import React from 'react'
import {mount} from 'enzyme'
import {EntryContent} from './EntryContent'

const expectedContent = 'expected content'

describe('EntryContent', () => {

  let props, state

  const createWrapper = () => mount(<EntryContent {...props} state={state} />)

  beforeEach(() => {
    props = {
      content: expectedContent,
      maybeVisible: false
    }

    state = {
      common: {
        mediaBreakpoint: 'desktop'
      },
      settings: {
        showEntryDetails: true
      }
    }
  })

  it('should set content as innerHTML', () => {
    expect(createWrapper().text()).toEqual(expectedContent)
  })

  it('should set content as innerHTML', () => {
    state.settings.showEntryDetails = false

    expect(createWrapper().text()).toEqual('')
  })

  it('should not render content on tablet or phone', () => {
    state.common.mediaBreakpoint = 'tablet'
    expect(createWrapper().text()).toEqual('')

    state.common.mediaBreakpoint = 'phone'
    expect(createWrapper().text()).toEqual('')
  })

  it('should render content on tablet or phone when prop "maybeVisible" is set tot true', () => {
    props.maybeVisible = true

    state.common.mediaBreakpoint = 'tablet'
    expect(createWrapper().text()).toEqual(expectedContent)

    state.common.mediaBreakpoint = 'phone'
    expect(createWrapper().text()).toEqual(expectedContent)
  })

  it('should render content on tablet or phone when prop "maybeVisible" is set tot true and prop "showEntryDetails" is set to false', () => {
    props.maybeVisible = true
    state.settings.showEntryDetails = false

    state.common.mediaBreakpoint = 'tablet'
    expect(createWrapper().text()).toEqual(expectedContent)

    state.common.mediaBreakpoint = 'phone'
    expect(createWrapper().text()).toEqual(expectedContent)
  })
})
