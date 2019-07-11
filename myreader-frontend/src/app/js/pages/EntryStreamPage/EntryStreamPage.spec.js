import React from 'react'
import {mount} from 'enzyme'
import {EntryStreamPage} from './EntryStreamPage'

/* eslint-disable react/prop-types */
jest.mock('../../components', () => ({
  EntryList: ({children}) => <div>{children}</div>,
  IconButton: ({children}) => <div>{children}</div>,
  ListLayout: ({actionPanel, listPanel}) => <div>{actionPanel}{listPanel}</div>
}))

jest.mock('../../contexts/locationState/withLocationState', () => ({
  withLocationState: Component => Component
}))

jest.mock('../../contexts', () => ({
  withAppContext: Component => Component
}))

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

  let props, value

  const createWrapper = () => {
    const mergedProps = {...value, ...props}
    return mount(
      <EntryStreamPage {...mergedProps} />
    )
  }

  beforeEach(() => {
    props = {
      searchParams: {
        q: 'expectedQ'
      },
      locationChanged: false,
      locationReload: false,
      showUnseenEntries: false,
      pageSize: 2,
      onKeyUp: jest.fn()
    }

    value = {
      mediaBreakpoint: 'desktop'
    }
  })

  it('should not render next and previous buttons when media breakpoint is not desktop', () => {
    value.mediaBreakpoint = 'phone'
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
    props.showUnseenEntries = false

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

    expect(props.onKeyUp).toHaveBeenCalledWith({key: 'ArrowLeft'})
  })

  it('should trigger prop function "onKeyUp" when next button clicked', () => {
    createWrapper().find(buttonNext).props().onClick()

    expect(props.onKeyUp).toHaveBeenCalledWith({key: 'ArrowRight'})
  })
})
