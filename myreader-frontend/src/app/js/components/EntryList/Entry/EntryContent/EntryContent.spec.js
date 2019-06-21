import React from 'react'
import {mount} from 'enzyme'
import {EntryContent} from './EntryContent'
import {useAppContext} from '../../../../contexts'

/* eslint-disable react/prop-types */
jest.mock('../../../../contexts', () => ({
  useAppContext: jest.fn()
}))
/* eslint-enable */

const expectedContent = 'expected content'

describe('EntryContent', () => {

  let props

  const createWrapper = () => mount(<EntryContent {...props} />)

  beforeEach(() => {
    useAppContext.mockClear()

    props = {
      content: expectedContent,
      maybeVisible: false
    }
  })

  it('should render content', () => {
    useAppContext.mockReturnValueOnce({
      showEntryDetails: true,
      mediaBreakpoint: 'desktop'
    })

    expect(createWrapper().text()).toEqual(expectedContent)
  })

  it('should not render content when "showEntryDetails" is set to false', () => {
    useAppContext.mockReturnValueOnce({
      showEntryDetails: false,
      mediaBreakpoint: 'desktop'
    })

    expect(createWrapper().text()).toEqual('')
  })

  it('should not render content on tablet or phone', () => {
    useAppContext.mockReturnValueOnce({
      showEntryDetails: true,
      mediaBreakpoint: 'tablet'
    })
    expect(createWrapper().text()).toEqual('')

    useAppContext.mockReturnValueOnce({
      showEntryDetails: true,
      mediaBreakpoint: 'phone'
    })
    expect(createWrapper().text()).toEqual('')
  })

  it('should render content on tablet or phone when "maybeVisible" is set tot true', () => {
    props.maybeVisible = true
    useAppContext.mockReturnValueOnce({
      showEntryDetails: true,
      mediaBreakpoint: 'tablet'
    })
    expect(createWrapper().text()).toEqual(expectedContent)

    useAppContext.mockReturnValueOnce({
      showEntryDetails: true,
      mediaBreakpoint: 'phone'
    })
    expect(createWrapper().text()).toEqual(expectedContent)
  })

  it('should render content on tablet or phone when "maybeVisible" is set to true and "showEntryDetails" is set to false', () => {
    props.maybeVisible = true
    useAppContext.mockReturnValueOnce({
      showEntryDetails: false,
      mediaBreakpoint: 'tablet'
    })
    expect(createWrapper().text()).toEqual(expectedContent)

    useAppContext.mockReturnValueOnce({
      showEntryDetails: true,
      mediaBreakpoint: 'phone'
    })
    expect(createWrapper().text()).toEqual(expectedContent)
  })
})
