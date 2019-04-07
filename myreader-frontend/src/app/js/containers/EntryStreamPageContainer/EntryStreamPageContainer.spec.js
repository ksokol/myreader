import React from 'react'
import {mount} from 'enzyme'
import EntryStreamPageContainer from './EntryStreamPageContainer'

/* eslint-disable react/prop-types */
jest.mock('../../pages', () => ({
  EntryStreamPage: () => null
}))
/* eslint-enable */

describe('EntryStreamPageContainer', () => {

  let state, dispatch

  const entryInFocus = () => ({uuid: 'uuid1', seen: false, origin: '1', createdAt: '1', title: '1', feedTitle: '1'})
  const nextFocusableEntry = () => ({uuid: 'uuid2', seen: false, origin: '2', createdAt: '2', title: '2', feedTitle: '2'})

  const createWrapper = () => {
    return mount(<EntryStreamPageContainer dispatch={dispatch} {...state} />).find('EntryStreamPage')
  }

  beforeEach(() => {
    dispatch = jest.fn().mockImplementation(action => {
      if (typeof action === 'function') {
        action(dispatch, () => state)
      }
    })

    state = {
      common: {
        mediaBreakpoint: 'tablet'
      },
      settings: {
        pageSize: 20,
        showUnseenEntries: false,
        showEntryDetails: true
      },
      entry: {
        entries: [
          entryInFocus(),
          nextFocusableEntry()
        ],
        loading: false,
        links: {},
        entryInFocus: 'uuid1'
      }
    }
  })

  it('should initialize component with given props', () => {
    expect(createWrapper().props()).toContainObject({
      entryInFocus: entryInFocus(),
      nextFocusableEntry: nextFocusableEntry(),
      isDesktop: false
    })
  })

  it('should dispatch action when prop function "changeEntry" triggered', () => {
    createWrapper().props().onChangeEntry({uuid: 'uuid1', seen: true, tag: 'expected tag'})

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'PATCH_ENTRY',
      url: '/myreader/api/2/subscriptionEntries/uuid1',
      body: {seen: true, tag: 'expected tag'}
    }))
  })

  it('should dispatch action when prop function "previousEntry" triggered', () => {
    createWrapper().props().previousEntry()

    expect(dispatch).toHaveBeenCalledWith({
      type: 'ENTRY_FOCUS_PREVIOUS',
      currentInFocus: 'uuid1'
    })
  })

  it('should dispatch action when prop function "entryFocusNext" triggered', () => {
    createWrapper().props().entryFocusNext()

    expect(dispatch).toHaveBeenCalledWith({
      type: 'ENTRY_FOCUS_NEXT',
      currentInFocus: 'uuid1'
    })
  })

  it('should dispatch action for next page when prop function "onLoadMore" triggered', () => {
    createWrapper().props().onLoadMore({path: 'expected-path', query: {}})

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'GET_ENTRIES',
      url: 'expected-path?seenEqual=*&size=20'
    }))
  })

  it('should dispatch ENTRY_PATCH action when prop function "onChangeEntry" triggered', () => {
    createWrapper().props().onChangeEntry({uuid: '1', seen: true, tag: 'expected tag'})

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'PATCH_ENTRY',
      url: '/myreader/api/2/subscriptionEntries/1',
      body: {seen: true, tag: 'expected tag'}
    }))
  })
})
