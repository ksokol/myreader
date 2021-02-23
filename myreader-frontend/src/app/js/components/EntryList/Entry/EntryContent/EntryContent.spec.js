import React from 'react'
import {mount} from 'enzyme'
import {EntryContent} from './EntryContent'
import {useSettings} from '../../../../contexts/settings'

/* eslint-disable react/prop-types */
jest.mock('../../../../contexts/settings', () => ({
  useSettings: jest.fn()
}))
/* eslint-enable */

const expectedContent = 'expected content'

describe('EntryContent', () => {

  let props

  const createWrapper = () => mount(<EntryContent {...props} />)

  beforeEach(() => {
    useSettings.mockClear()

    props = {
      content: expectedContent,
      maybeVisible: false
    }
  })

  it('should render content', () => {
    useSettings.mockReturnValueOnce({showEntryDetails: true})

    expect(createWrapper().text()).toEqual(expectedContent)
  })

  it('should not render content when "showEntryDetails" and "maybeVisible" are set to false', () => {
    useSettings.mockReturnValueOnce({showEntryDetails: false})

    expect(createWrapper().text()).toEqual('')
  })

  it('should render content when "maybeVisible" is set to true and "showEntryDetails" is set to false', () => {
    props.maybeVisible = true
    useSettings.mockReturnValueOnce({showEntryDetails: false})

    expect(createWrapper().text()).toEqual(expectedContent)
  })
})
