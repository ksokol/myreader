import React from 'react'
import {mount} from 'enzyme'
import FeedEditPage from './FeedEditPage'

/* eslint-disable react/prop-types */
jest.mock('../../components', () => ({
  FeedEditForm: () => null
}))
/* eslint-enable */

describe('FeedEditPage', () => {

  let state, dispatch, props

  const createWrapper = () => {
    return mount(<FeedEditPage props={props} dispatch={dispatch} state={state} />).find('FeedEditPage')
  }

  beforeEach(() => {
    dispatch = jest.fn()

    state = {
      admin: {
        editForm: {
          changePending: true,
          data: {uuid: '1', title: 'title1', url: 'url1', createdAt: '2017-12-29'},
          validations: [{field: 'title', message: 'may not be empty'}]
        },
        fetchFailuresLoading: true,
        fetchFailures: {
          links: {next: {path: 'next', query: {a: 'b'}}},
          failures: [{uuid: '2', createdAt: '2017-01-29'}, {uuid: '3', createdAt: '2017-02-28'}]
        }
      }
    }

    props = {
      match: {
        params: {
          uuid: 'uuid1'
        }
      }
    }
  })

  it('should initialize component with given props', () => {
    expect(createWrapper().props()).toContainObject({
      changePending: true,
      fetchFailuresLoading: true,
      data: {uuid: '1', title: 'title1', url: 'url1', createdAt: '2017-12-29'},
      validations: [{field: 'title', message: 'may not be empty'}],
      links: {next: {path: 'next', query: {a: 'b'}}},
      failures: [{uuid: '2', createdAt: '2017-01-29'}, {uuid: '3', createdAt: '2017-02-28'}]
    })
  })

  it('should dispatch expected action when prop function "onChangeFormData" triggered', () => {
    createWrapper().props().onChangeFormData({a: 'b', c: 'd'})

    expect(dispatch).toHaveBeenCalledWith({
      type: 'FEED_EDIT_FORM_CHANGE_DATA',
      data: {a: 'b', c: 'd'}
    })
  })

  it('should dispatch expected action when prop function "onSaveFormData" triggered', () => {
    createWrapper().props().onSaveFormData({uuid: '1', a: 'b', c: 'd'})

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'PATCH_FEED',
      url: 'api/2/feeds/1',
      body: {a: 'b', c: 'd', uuid: '1'}
    }))
  })

  it('should dispatch expected action when prop function "onRemove" triggered', () => {
    createWrapper().props().onRemove('1')

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'DELETE_FEED',
      url: 'api/2/feeds/1'
    }))
  })

  it('should dispatch expected action when prop function "onMore" triggered', () => {
    createWrapper().props().onMore({path: 'next', query: {a: 'b'}})

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'GET_FEED_FETCH_FAILURES',
      url: 'next?a=b'
    }))
  })

  it('should dispatch expected actions when mounted', () => {
    createWrapper()

    expect(dispatch).toHaveBeenNthCalledWith(1, {type: 'FEED_EDIT_FORM_CLEAR'})
    expect(dispatch).toHaveBeenNthCalledWith(2, {type: 'FEED_FETCH_FAILURES_CLEAR'})
    expect(dispatch).toHaveBeenNthCalledWith(3, expect.objectContaining({
      type: 'GET_FEED',
      url: 'api/2/feeds/uuid1'
    }))
    expect(dispatch).toHaveBeenNthCalledWith(4, expect.objectContaining({
      type: 'GET_FEED_FETCH_FAILURES',
      url: 'api/2/feeds/uuid1/fetchError'
    }))
  })
})
