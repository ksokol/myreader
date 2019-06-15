import React from 'react'
import {mount} from 'enzyme'
import {EntryContent} from './EntryContent'
import MediaBreakpointContext from '../../../../contexts/mediaBreakpoint/MediaBreakpointContext'

const expectedContent = 'expected content'

describe('EntryContent', () => {

  let props, state, value

  const createWrapper = () => (
    mount(
      <MediaBreakpointContext.Provider value={value}>
        <EntryContent {...props} state={state} />
      </MediaBreakpointContext.Provider>
    )
  )

  beforeEach(() => {
    props = {
      content: expectedContent,
      maybeVisible: false
    }

    state = {
      settings: {
        showEntryDetails: true
      }
    }

    value = {
      mediaBreakpoint: 'desktop'
    }
  })

  it('should render content', () => {
    expect(createWrapper().text()).toEqual(expectedContent)
  })

  it('should not render content when prop "showEntryDetails" is set to false', () => {
    state.settings.showEntryDetails = false

    expect(createWrapper().text()).toEqual('')
  })

  it('should not render content on tablet or phone', () => {
    value.mediaBreakpoint = 'tablet'
    expect(createWrapper().text()).toEqual('')

    value.mediaBreakpoint = 'phone'
    expect(createWrapper().text()).toEqual('')
  })

  it('should render content on tablet or phone when prop "maybeVisible" is set tot true', () => {
    props.maybeVisible = true

    value.mediaBreakpoint = 'tablet'
    expect(createWrapper().text()).toEqual(expectedContent)

    value.mediaBreakpoint = 'phone'
    expect(createWrapper().text()).toEqual(expectedContent)
  })

  it('should render content on tablet or phone when prop "maybeVisible" is set to true and prop "showEntryDetails" is set to false', () => {
    props.maybeVisible = true
    state.settings.showEntryDetails = false

    value.mediaBreakpoint = 'tablet'
    expect(createWrapper().text()).toEqual(expectedContent)

    value.mediaBreakpoint = 'phone'
    expect(createWrapper().text()).toEqual(expectedContent)
  })
})
