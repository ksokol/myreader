import React from 'react'
import {mount} from 'enzyme'
import FeedEditPage from './FeedEditPage'

/* eslint-disable react/prop-types */
jest.mock('../../components', () => ({
  FeedEditForm: () => <p />
}))
/* eslint-enable */

describe('FeedEditPage', () => {

  let state, dispatch, props

  const createWrapper = ({init} = {init: true}) => {
    const wrapper = mount(<FeedEditPage {...props} dispatch={dispatch} state={state} />)
    if (init) {
      dispatch.mock.calls[2][0].success({uuid: 'uuid1', title: 'title1', links: [{rel: 'self', href: '/self?a=b'}]})
      wrapper.update()
    }
    return wrapper
  }

  beforeEach(() => {
    dispatch = jest.fn().mockImplementation(action => {
      if (typeof action === 'function') {
        action(dispatch, () => state)
      }
    })

    state = {
      common: {
        notification: {
          nextId: 1
        }
      },
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

  it('should not render feed edit form when prop "feed" is null', () => {
    expect(createWrapper({init: false}).find('FeedEditForm').exists()).toEqual(false)
  })

  it('should render feed edit form when prop "feed" is defined', () => {
    expect(createWrapper().find('FeedEditForm').exists()).toEqual(true)
  })

  it('should initialize component with given props when mounted', () => {
    expect(createWrapper().find('FeedEditForm').props()).toEqual(expect.objectContaining({
      changePending: false,
      fetchFailuresLoading: true,
      data: {uuid: 'uuid1', title: 'title1', links: {self: {path: '/self', query: {a: 'b'}}}},
      validations: [], //{field: 'title', message: 'may not be empty'}
      links: {next: {path: 'next', query: {a: 'b'}}},
      failures: [{uuid: '2', createdAt: '2017-01-29'}, {uuid: '3', createdAt: '2017-02-28'}],
    }))
  })

  it('should dispatch expected action when prop function "onSaveFormData" triggered', () => {
    const wrapper = createWrapper()
    wrapper.find('FeedEditForm').props().onSaveFormData({uuid: '1', a: 'b', c: 'd'})

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'PATCH_FEED',
      url: 'api/2/feeds/1',
      body: {a: 'b', c: 'd', uuid: '1'}
    }))
  })

  it('should set prop "changePending" to true when prop function "onSaveFormData" called', () => {
    const wrapper = createWrapper()
    wrapper.find('FeedEditForm').props().onSaveFormData({uuid: '1', a: 'b', c: 'd'})
    wrapper.update()

    expect(wrapper.find('FeedEditForm').prop('changePending')).toEqual(true)
  })

  it('should set prop "changePending" to false when prop function "onSaveFormData" finished', () => {
    const wrapper = createWrapper()
    dispatch.mockReset()
    wrapper.find('FeedEditForm').props().onSaveFormData({uuid: '1', a: 'b', c: 'd'})
    wrapper.update()

    dispatch.mock.calls[0][0].finalize()
    wrapper.update()

    expect(wrapper.find('FeedEditForm').prop('changePending')).toEqual(false)
  })

  it('should dispatch action SHOW_NOTIFICATION when prop function "onSaveFormData" succeeded', () => {
    const wrapper = createWrapper()
    dispatch.mockReset()
    wrapper.find('FeedEditForm').props().onSaveFormData({uuid: '1', a: 'b', c: 'd'})
    wrapper.update()
    dispatch.mock.calls[0][0].success()(dispatch, () => state)

    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: 'SHOW_NOTIFICATION',
      notification: {
        id: 1,
        text: 'Feed saved',
        type: 'success'
      }
    })
  })

  it('should pass state "validations" to feed edit page when prop function "onSaveFormData" failed', () => {
    const wrapper = createWrapper()
    dispatch.mockReset()
    wrapper.find('FeedEditForm').props().onSaveFormData({uuid: '1', a: 'b', c: 'd'})
    wrapper.update()
    dispatch.mock.calls[0][0].error({status: 400, fieldErrors: ['error']})
    wrapper.update()

    expect(wrapper.find('FeedEditForm').prop('validations')).toEqual(['error'])
  })

  it('should not pass state "validations" to feed edit page when prop function "onSaveFormData" failed', () => {
    const wrapper = createWrapper()
    dispatch.mockReset()
    wrapper.find('FeedEditForm').props().onSaveFormData({uuid: '1', a: 'b', c: 'd'})
    wrapper.update()
    dispatch.mock.calls[0][0].error({status: 401, fieldErrors: ['error']})
    wrapper.update()

    expect(wrapper.find('FeedEditForm').prop('validations')).toEqual([])
  })

  it('should dispatch expected action when prop function "onRemove" triggered', () => {
    const wrapper = createWrapper()
    wrapper.find('FeedEditForm').props().onRemove('1')

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'DELETE_FEED',
      url: 'api/2/feeds/1'
    }))
  })

  it('should set prop "changePending" to true when prop function "onRemove" called', () => {
    const wrapper = createWrapper()
    wrapper.find('FeedEditForm').props().onRemove('1')
    wrapper.update()

    expect(wrapper.find('FeedEditForm').prop('changePending')).toEqual(true)
  })

  it('should set prop "changePending" to false when prop function "onRemove" finished', () => {
    const wrapper = createWrapper()
    wrapper.find('FeedEditForm').props().onSaveFormData({uuid: '1', a: 'b', c: 'd'})
    wrapper.update()
    dispatch.mockReset()
    wrapper.find('FeedEditForm').props().onRemove('1')
    wrapper.update()
    dispatch.mock.calls[0][0].finalize()
    wrapper.update()

    expect(wrapper.find('FeedEditForm').prop('changePending')).toEqual(false)
  })

  it('should dispatch action ROUTE_CHANGED and FEED_DELETED when prop function "onRemove" succeeded', () => {
    const wrapper = createWrapper()
    wrapper.find('FeedEditForm').props().onSaveFormData({uuid: '1', a: 'b', c: 'd'})
    wrapper.update()
    dispatch.mockReset()
    wrapper.find('FeedEditForm').props().onRemove('1')
    wrapper.update()

    const successActions = dispatch.mock.calls[0][0].success()

    expect(successActions[0]()).toEqual(expect.objectContaining({
      type: 'ROUTE_CHANGED',
      route: ['app', 'feed']
    }))
    expect(successActions[1]()).toEqual(expect.objectContaining({
      type: 'FEED_DELETED',
      uuid: '1'
    }))
  })

  it('should dispatch action SHOW_NOTIFICATION when prop function "onRemove" failed with HTTP 409', () => {
    const wrapper = createWrapper()
    dispatch.mockReset()
    wrapper.find('FeedEditForm').props().onRemove('1')
    wrapper.update()

    dispatch.mock.calls[0][0].error('response', null, 409)(dispatch, () => state)

    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: 'SHOW_NOTIFICATION',
      notification: {
        id: 1,
        text: 'Can not delete. Feed has subscriptions',
        type: 'error'
      }
    })
  })

  it('should dispatch action SHOW_NOTIFICATION when prop function "onRemove" failed with HTTP 400', () => {
    const wrapper = createWrapper()
    dispatch.mockReset()
    wrapper.find('FeedEditForm').props().onRemove('1')
    wrapper.update()

    expect(dispatch.mock.calls[0][0].error('response', null, 400)).toEqual(undefined)
  })

  it('should dispatch action SHOW_NOTIFICATION when prop function "onRemove" failed with HTTP 500', () => {
    const wrapper = createWrapper()
    dispatch.mockReset()
    wrapper.find('FeedEditForm').props().onRemove('1')
    wrapper.update()

    dispatch.mock.calls[0][0].error('response', null, 500)(dispatch, () => state)

    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: 'SHOW_NOTIFICATION',
      notification: {
        id: 1,
        text: 'response',
        type: 'error'
      }
    })
  })

  it('should dispatch expected action when prop function "onMore" triggered', () => {
    const wrapper = createWrapper()
    wrapper.find('FeedEditForm').props().onMore({path: 'next', query: {a: 'b'}})

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'GET_FEED_FETCH_FAILURES',
      url: 'next?a=b'
    }))
  })

  it('should dispatch expected actions when mounted', () => {
    createWrapper()

    expect(dispatch).toHaveBeenNthCalledWith(1, {type: 'FEED_FETCH_FAILURES_CLEAR'})
    expect(dispatch).toHaveBeenNthCalledWith(2, expect.objectContaining({
      type: 'GET_FEED_FETCH_FAILURES',
      url: 'api/2/feeds/uuid1/fetchError'
    }))
    expect(dispatch).toHaveBeenNthCalledWith(3, expect.objectContaining({
      type: 'GET_FEED',
      url: 'api/2/feeds/uuid1'
    }))
  })
})
