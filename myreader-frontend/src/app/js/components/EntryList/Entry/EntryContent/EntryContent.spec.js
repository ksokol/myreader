import React from 'react'
import {mount} from 'enzyme'
import {EntryContent} from './EntryContent'
import {useMediaBreakpoint} from '../../../../contexts/mediaBreakpoint'
import {useSettings} from '../../../../contexts/settings'

/* eslint-disable react/prop-types */
jest.mock('../../../../contexts/mediaBreakpoint', () => ({
  useMediaBreakpoint: jest.fn()
}))

jest.mock('../../../../contexts/settings', () => ({
  useSettings: jest.fn()
}))
/* eslint-enable */

const expectedContent = 'expected content'

describe('EntryContent', () => {

  let props

  const createWrapper = () => mount(<EntryContent {...props} />)

  beforeEach(() => {
    useMediaBreakpoint.mockClear()
    useSettings.mockClear()

    props = {
      content: expectedContent,
      maybeVisible: false
    }
  })

  it('should render content', () => {
    useSettings.mockReturnValueOnce({showEntryDetails: true})
    useMediaBreakpoint.mockReturnValueOnce({mediaBreakpoint: 'desktop'})

    expect(createWrapper().text()).toEqual(expectedContent)
  })

  it('should not render content when "showEntryDetails" is set to false', () => {
    useSettings.mockReturnValueOnce({showEntryDetails: false})
    useMediaBreakpoint.mockReturnValueOnce({mediaBreakpoint: 'desktop'})

    expect(createWrapper().text()).toEqual('')
  })

  it('should not render content on tablet or phone', () => {
    useSettings.mockReturnValueOnce({showEntryDetails: false})
    useMediaBreakpoint.mockReturnValueOnce({mediaBreakpoint: 'tablet'})

    expect(createWrapper().text()).toEqual('')

    useSettings.mockReturnValueOnce({showEntryDetails: true})
    useMediaBreakpoint.mockReturnValueOnce({mediaBreakpoint: 'phone'})

    expect(createWrapper().text()).toEqual('')
  })

  it('should render content on tablet or phone when "maybeVisible" is set tot true', () => {
    props.maybeVisible = true
    useSettings.mockReturnValueOnce({showEntryDetails: true})
    useMediaBreakpoint.mockReturnValueOnce({mediaBreakpoint: 'tablet'})

    expect(createWrapper().text()).toEqual(expectedContent)

    useSettings.mockReturnValueOnce({showEntryDetails: true})
    useMediaBreakpoint.mockReturnValueOnce({mediaBreakpoint: 'phone'})

    expect(createWrapper().text()).toEqual(expectedContent)
  })

  it('should render content on tablet or phone when "maybeVisible" is set to true and "showEntryDetails" is set to false', () => {
    props.maybeVisible = true
    useSettings.mockReturnValueOnce({showEntryDetails: false})
    useMediaBreakpoint.mockReturnValueOnce({mediaBreakpoint: 'tablet'})

    expect(createWrapper().text()).toEqual(expectedContent)

    useSettings.mockReturnValueOnce({showEntryDetails: true})
    useMediaBreakpoint.mockReturnValueOnce({mediaBreakpoint: 'phone'})

    expect(createWrapper().text()).toEqual(expectedContent)
  })
})
