import React from 'react'
import {mount} from 'enzyme'
import FeedEditPage from './FeedEditPage'
import {ADMIN_FEEDS_URL} from '../../constants'

/* eslint-disable react/prop-types */
jest.mock('../../components', () => ({
  FeedEditForm: () => <p />
}))

jest.mock('../../contexts', () => ({
  withLocationState: Component => Component,
  withNotification: Component => Component
}))
/* eslint-enable */

describe('FeedEditPage', () => {

  let state, dispatch, props

  const createWrapper = ({init} = {init: true}) => {
    const wrapper = mount(<FeedEditPage {...props} dispatch={dispatch} state={state} />)
    if (init) {
      dispatch.mock.calls[0][0].success({uuid: 'uuid1', title: 'title1', links: [{rel: 'self', href: '/self?a=b'}]})
      wrapper.update()
    }
    return wrapper
  }

  beforeEach(() => {
    dispatch = jest.fn()

    state = {
      admin: {
        editForm: {
          changePending: true,
          data: {uuid: '1', title: 'title1', url: 'url1', createdAt: '2017-12-29'},
          validations: [{field: 'title', message: 'may not be empty'}]
        }
      }
    }

    props = {
      params: {
        uuid: 'uuid1'
      },
      historyReplace: jest.fn(),
      showSuccessNotification: jest.fn(),
      showErrorNotification: jest.fn()
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
      data: {uuid: 'uuid1', title: 'title1', links: {self: {path: '/self', query: {a: 'b'}}}},
      validations: []
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

  it('should trigger prop function "showSuccessNotification" when prop function "onSaveFormData" succeeded', () => {
    const wrapper = createWrapper()
    dispatch.mockReset()
    wrapper.find('FeedEditForm').props().onSaveFormData({uuid: '1', a: 'b', c: 'd'})
    wrapper.update()
    dispatch.mock.calls[0][0].success()

    expect(props.showSuccessNotification).toHaveBeenCalledWith('Feed saved')
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

  it('should clear state "validations" when prop function "onSaveFormData" triggered', () => {
    const wrapper = createWrapper()
    dispatch.mockReset()
    wrapper.find('FeedEditForm').props().onSaveFormData({uuid: '1', a: 'b', c: 'd'})
    wrapper.update()
    dispatch.mock.calls[0][0].error({status: 400, fieldErrors: ['error']})
    wrapper.update()
    wrapper.find('FeedEditForm').props().onSaveFormData({uuid: '1', a: 'b', c: 'd'})
    wrapper.update()

    expect(wrapper.find('FeedEditForm').prop('validations')).toEqual([])
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

  it('should set prop "changePending" to false when prop function "onRemove" failed', () => {
    const wrapper = createWrapper()
    wrapper.find('FeedEditForm').props().onSaveFormData({uuid: '1', a: 'b', c: 'd'})
    wrapper.update()
    dispatch.mockReset()
    wrapper.find('FeedEditForm').props().onRemove('1')
    wrapper.update()
    dispatch.mock.calls[0][0].error()
    wrapper.update()

    expect(wrapper.find('FeedEditForm').prop('changePending')).toEqual(false)
  })

  it('should redirect to feed list page when prop function "onRemove" succeeded', () => {
    const wrapper = createWrapper()
    wrapper.find('FeedEditForm').props().onSaveFormData({uuid: '1', a: 'b', c: 'd'})
    wrapper.update()
    dispatch.mockReset()
    wrapper.find('FeedEditForm').props().onRemove('1')
    wrapper.update()

    dispatch.mock.calls[0][0].success()

    expect(props.historyReplace).toHaveBeenCalledWith({pathname: ADMIN_FEEDS_URL})
  })

  it('should trigger prop function "showErrorNotification" when prop function "onRemove" failed with HTTP 409', () => {
    const wrapper = createWrapper()
    dispatch.mockReset()
    wrapper.find('FeedEditForm').props().onRemove('1')
    wrapper.update()
    dispatch.mock.calls[0][0].error('response', null, 409)

    expect(props.showErrorNotification).toHaveBeenCalledWith('Can not delete. Feed has subscriptions')
  })

  it('should dispatch action SHOW_NOTIFICATION when prop function "onRemove" failed with HTTP 400', () => {
    const wrapper = createWrapper()
    dispatch.mockReset()
    wrapper.find('FeedEditForm').props().onRemove('1')
    wrapper.update()

    expect(dispatch.mock.calls[0][0].error('response', null, 400)).toEqual(undefined)
  })

  it('should trigger prop function "showErrorNotification" when prop function "onRemove" failed with HTTP 500', () => {
    const wrapper = createWrapper()
    dispatch.mockReset()
    wrapper.find('FeedEditForm').props().onRemove('1')
    wrapper.update()

    dispatch.mock.calls[0][0].error('response', null, 500)

    expect(props.showErrorNotification).toHaveBeenCalledWith('response')
  })

  it('should dispatch expected actions when mounted', () => {
    createWrapper()

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'GET_FEED',
      url: 'api/2/feeds/uuid1'
    }))
  })
})
