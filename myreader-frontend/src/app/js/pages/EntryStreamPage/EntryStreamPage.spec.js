import React from 'react'
import {mount} from 'enzyme'
import {EntryStreamPage} from './EntryStreamPage'
import {useSettings} from '../../contexts/settings'
import {useMediaBreakpoint} from '../../contexts/mediaBreakpoint'
import {useHotkeys} from '../../contexts/hotkeys'
import {useHistory, useSearchParams} from '../../hooks/router'

/* eslint-disable react/prop-types, react/display-name */
jest.mock('../../components', () => ({
  IconButton: ({children}) => <div>{children}</div>,
}))

jest.mock('../../components/ListLayout/ListLayout', () => ({
  ListLayout: ({actionPanel, listPanel}) => <div>{actionPanel}{listPanel}</div>,
}))

jest.mock('../../components/EntryList/EntryList', () => ({
  EntryList: ({children}) => <div>{children}</div>,
}))

jest.mock('../../hooks/router', () => {
  const push = jest.fn()
  const reload = jest.fn()

  return {
    useSearchParams: jest.fn().mockReturnValue({
      feedTagEqual: 'a',
      q: 'expectedQ',
    }),
    useHistory: () => ({
      push,
      reload,
    })
  }
})

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

jest.mock('../../hooks/router', () => {
  const push = jest.fn()
  const reload = jest.fn()

  return {
    useSearchParams: jest.fn().mockReturnValue({
      a: 'b',
      q: 'q'
    }),
    useHistory: () => ({
      push,
      reload,
    })
  }
})
/* eslint-enable */

const buttonPrevious = 'IconButton[type="chevron-left"]'
const buttonNext = 'IconButton[type="chevron-right"]'

describe('EntryStreamPage', () => {

  const createWrapper = () => {
    return mount(<EntryStreamPage />)
  }

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
    useSettings.mockReturnValueOnce({
      pageSize: 2,
      showUnseenEntries: false,
    })

    expect(createWrapper().find('EntryList').prop('query')).toEqual({
      feedTagEqual: 'a',
      q: 'expectedQ',
      seenEqual: '*',
      size: 2
    })
  })

  it('should pass expected props to entry list component with seenEqual set to true and prop "searchParams.seenEqual" set to true', () => {
    useSearchParams.mockReturnValueOnce({
      q: 'expectedQ',
      seenEqual: true,
    })

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

  it('should pass expected props to search input component', () => {
    expect(createWrapper().find('SearchInput').prop('value')).toEqual('expectedQ')
  })

  it('should trigger history push when search input value changed', () => {
    const wrapper = createWrapper()
    wrapper.find('SearchInput').props().onChange('changed q')
    wrapper.mount()
    wrapper.update()

    expect(useHistory().push).toHaveBeenCalledWith({
      searchParams: {
        feedTagEqual: 'a',
        q: 'changed q'
      }
    })
  })

  it('should trigger history push when search params and search input value changed', done => {
    jest.useRealTimers()
    const wrapper = createWrapper()

    useSearchParams.mockReturnValueOnce({
      feedTagEqual: 'b',
    })
    wrapper.mount()

    wrapper.find('input[name="search-input"]').simulate('change', {
      target: {
        value: 'changed q'
      }
    })

    setTimeout(() => {
      expect(useHistory().push).toHaveBeenCalledWith({
        searchParams: {
          feedTagEqual: 'b',
          q: 'changed q'
        }
      })
      done()
    }, 250)
  })

  it('should trigger history reload when refresh icon button clicked', () => {
    createWrapper().find('[type="redo"]').props().onClick()

    expect(useHistory().reload).toHaveBeenCalled()
  })
})
