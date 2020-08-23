import React from 'react'
import {mount} from 'enzyme'
import {EntryStreamPage} from './EntryStreamPage'
import {useSettings} from '../../contexts/settings'
import {useMediaBreakpoint} from '../../contexts/mediaBreakpoint'
import {useHotkeys} from '../../contexts/hotkeys'

/* eslint-disable react/prop-types, react/display-name */
jest.mock('../../components', () => ({
  EntryList: ({children}) => <div>{children}</div>,
  IconButton: ({children}) => <div>{children}</div>,
}))

jest.mock('../../components/ListLayout/ListLayout', () => ({
  ListLayout: ({actionPanel, listPanel}) => <div>{actionPanel}{listPanel}</div>,
}))

jest.mock('../../contexts/locationState/withLocationState', () => ({
  withLocationState: Component => Component
}))

jest.mock('../../contexts/settings', () => ({
  useSettings: jest.fn().mockReturnValue({
    pageSize: 2,
    showUnseenEntries: true,
  })
}))

jest.mock('../../contexts/mediaBreakpoint', () => ({
  useMediaBreakpoint: jest.fn().mockReturnValue({
    mediaBreakpoint: 'desktop',
  })
}))

jest.mock('../../contexts/hotkeys', () => {
  const onKeyUp = jest.fn()

  return {
    useHotkeys: () => ({
      onKeyUp
    })
  }
})

jest.mock('../../components/EntryList/withAutofocusEntry', () => ({
  withAutofocusEntry: Component => Component
}))

jest.mock('../../components/EntryList/withEntriesFromApi', () => ({
  withEntriesFromApi: Component => Component
}))
/* eslint-enable */

const buttonPrevious = 'IconButton[type="chevron-left"]'
const buttonNext = 'IconButton[type="chevron-right"]'

describe('EntryStreamPage', () => {

  let props

  const createWrapper = () => {
    return mount(
      <EntryStreamPage {...props} />
    )
  }

  beforeEach(() => {
    props = {
      searchParams: {
        q: 'expectedQ'
      },
    }
  })

  it('should not render next and previous buttons when media breakpoint is not desktop', () => {
    useMediaBreakpoint.mockReturnValueOnce(() => ({
      mediaBreakpoint: 'phone',
    }))
    const wrapper = createWrapper()

    expect(wrapper.find(buttonPrevious).exists()).toEqual(false)
    expect(wrapper.find(buttonNext).exists()).toEqual(false)
  })

  it('should render next and previous buttons when media breakpoint is desktop', () => {
    const wrapper = createWrapper()

    expect(wrapper.find(buttonPrevious).exists()).toEqual(true)
    expect(wrapper.find(buttonNext).exists()).toEqual(true)
  })

  it('should pass expected props to entry list component with seenEqual set to "*" and prop "showUnseenEntries" set to false', () => {
    useSettings.mockReturnValue({
      pageSize: 2,
      showUnseenEntries: false,
    })

    expect(createWrapper().find('EntryList').prop('query')).toEqual({
      q: 'expectedQ',
      seenEqual: '*',
      size: 2
    })
  })

  it('should pass expected props to entry list component with seenEqual set to true and prop "searchParams.seenEqual" set to true', () => {
    props.searchParams.seenEqual = true

    expect(createWrapper().find('EntryList').prop('query')).toEqual({
      q: 'expectedQ',
      seenEqual: true,
      size: 2
    })
  })

  it('should trigger prop function "onKeyUp" when previous button clicked', () => {
    createWrapper().find(buttonPrevious).props().onClick()

    expect(useHotkeys().onKeyUp).toHaveBeenCalledWith({key: 'ArrowLeft'})
  })

  it('should trigger prop function "onKeyUp" when next button clicked', () => {
    createWrapper().find(buttonNext).props().onClick()

    expect(useHotkeys().onKeyUp).toHaveBeenCalledWith({key: 'ArrowRight'})
  })
})
