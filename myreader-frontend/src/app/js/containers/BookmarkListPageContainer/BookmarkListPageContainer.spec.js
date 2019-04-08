import React from 'react'
import {mount} from 'enzyme'
import BookmarkListPageContainer from './BookmarkListPageContainer'

/* eslint-disable react/prop-types */
jest.mock('../../pages', () => ({
  BookmarkListPage: () => null
}))
/* eslint-enable */

describe('BookmarkListPageContainer', () => {

  let state, dispatch

  const createWrapper = () => {
    return mount(<BookmarkListPageContainer dispatch={dispatch} state={state} />).find('BookmarkListPage')
  }

  beforeEach(() => {
    dispatch = jest.fn().mockImplementation(action => {
      if (typeof action === 'function') {
        action(dispatch, () => state)
      }
    })

    state = {
      settings: {},
      common: {},
      entry: {
        entries: [],
        links: {},
        loading: false,
        tags: ['tag1', 'tag2']
      }
    }
  })

  it('should initialize component with given props', () => {
    expect(createWrapper().props()).toContainObject({
      entryTags: ['tag1', 'tag2']
    })
  })

  it('should dispatch action for next page when prop function "onLoadMore" triggered', () => {
    createWrapper().props().onLoadMore({path: 'expected-path', query: {}})

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'GET_ENTRIES',
      url: 'expected-path?seenEqual=*'
    }))
  })

  it('should dispatch ENTRY_PATCH action when prop function "onChangeEntry" triggered', () => {
    createWrapper().props().onChangeEntry({uuid: '1', seen: true, tag: 'expected tag'})

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'PATCH_ENTRY',
      body: {seen: true, tag: 'expected tag'}
    }))
  })
})
