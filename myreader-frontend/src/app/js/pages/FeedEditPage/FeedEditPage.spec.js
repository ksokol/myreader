import React from 'react'
import {mount} from 'enzyme'
import FeedEditPage from './FeedEditPage'
import {ADMIN_FEEDS_URL} from '../../constants'
import {feedApi} from '../../api'
import {flushPromises} from '../../shared/test-utils'

/* eslint-disable react/prop-types */
jest.mock('../../components/FeedEditForm/FeedEditForm', () => ({
  FeedEditForm: () => null
}))

jest.mock('../../contexts', () => ({
  withLocationState: Component => Component,
  withNotification: Component => Component
}))

jest.mock('../../api', () => ({
  feedApi: {}
}))
/* eslint-enable */

const pending = () => jest.fn().mockReturnValue(new Promise(() => {}))

const resolved = (value = {}) => jest.fn().mockResolvedValueOnce(value)

const rejected = (value = {}) => jest.fn().mockRejectedValueOnce(value)

describe('FeedEditPage', () => {

  let props

  const createWrapper = async (onMount = resolved()) => {
    feedApi.fetchFeed = onMount

    const wrapper = mount(<FeedEditPage {...props} />)
    await flushPromises()
    wrapper.update()
    return wrapper
  }

  beforeEach(() => {
    props = {
      params: {
        uuid: 'uuid1'
      },
      historyReplace: jest.fn(),
      showSuccessNotification: jest.fn(),
      showErrorNotification: jest.fn()
    }
  })

  it('should not render feed edit form when state "feed" is null', async () => {
    const wrapper = await createWrapper(pending())

    expect(wrapper.find('FeedEditForm').exists()).toEqual(false)
  })

  it('should call feedApi.fetchFeed with prop "params.uuid" when mounted', async () => {
    await createWrapper()

    expect(feedApi.fetchFeed).toHaveBeenCalledWith('uuid1')
  })

  it('should initialize component with given state when mounted', async () => {
    const wrapper = await createWrapper(resolved({a: 'b', c: 'd'}))

    expect(wrapper.find('FeedEditForm').props()).toEqual(expect.objectContaining({
      changePending: false,
      data: {a: 'b', c: 'd'},
      validations: []
    }))
  })

  it('should call feedApi.saveFeed when prop function "onSaveFormData" called', async () => {
    feedApi.saveFeed = resolved()
    const wrapper = await createWrapper()
    wrapper.find('FeedEditForm').props().onSaveFormData({uuid: '1', a: 'b', c: 'd'})

    expect(feedApi.saveFeed).toHaveBeenCalledWith({
      a: 'b',
      c: 'd',
      uuid: '1'
    })
  })

  it('should set prop "changePending" to true when prop function "onSaveFormData" called', async () => {
    const wrapper = await createWrapper()
    wrapper.find('FeedEditForm').props().onSaveFormData({})
    wrapper.update()

    expect(wrapper.find('FeedEditForm').prop('changePending')).toEqual(true)
  })

  it('should set prop "changePending" to false when call to feedApi.saveFeed succeeded', async () => {
    feedApi.saveFeed = resolved()
    const wrapper = await createWrapper()
    wrapper.find('FeedEditForm').props().onSaveFormData({})
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('FeedEditForm').prop('changePending')).toEqual(false)
  })

  it('should trigger prop function "showSuccessNotification" when call to feedApi.saveFeed succeeded', async () => {
    feedApi.saveFeed = resolved()
    const wrapper = await createWrapper()
    wrapper.find('FeedEditForm').props().onSaveFormData({})
    await flushPromises()

    expect(props.showSuccessNotification).toHaveBeenCalledWith('Feed saved')
  })

  it('should pass state "validations" to feed edit page when call to feedApi.saveFeed failed', async () => {
    feedApi.saveFeed = rejected({status: 400, data: {fieldErrors: ['error']}})
    const wrapper = await createWrapper()
    wrapper.find('FeedEditForm').props().onSaveFormData({})
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('FeedEditForm').prop('validations')).toEqual(['error'])
  })

  it('should clear state "validations" when prop function "onSaveFormData" called again', async () => {
    feedApi.saveFeed = rejected({status: 400, data: {fieldErrors: ['error']}})
    const wrapper = await createWrapper()
    wrapper.find('FeedEditForm').props().onSaveFormData({})
    await flushPromises()
    wrapper.find('FeedEditForm').props().onSaveFormData({})
    wrapper.update()

    expect(wrapper.find('FeedEditForm').prop('validations')).toEqual([])
  })

  it('should not pass state "validations" to feed edit page when call to feedApi.saveFeed failed with HTTP != 400', async () => {
    feedApi.saveFeed = rejected({status: 401, fieldErrors: ['error']})
    const wrapper = await createWrapper()
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('FeedEditForm').prop('validations')).toEqual([])
  })

  it('should call feedApi.deleteFeed when prop function "onRemove" called', async () => {
    feedApi.deleteFeed = pending()
    const wrapper = await createWrapper()
    wrapper.find('FeedEditForm').props().onRemove('uuid1')

    expect(feedApi.deleteFeed).toHaveBeenCalledWith('uuid1')
  })

  it('should set prop "changePending" to true when prop function "onRemove" called', async () => {
    feedApi.deleteFeed = pending()
    const wrapper = await createWrapper()
    wrapper.find('FeedEditForm').props().onRemove()
    wrapper.update()

    expect(wrapper.find('FeedEditForm').prop('changePending')).toEqual(true)
  })

  it('should set prop "changePending" to false when call to feedApi.deleteFeed failed', async () => {
    feedApi.deleteFeed = rejected()
    const wrapper = await createWrapper()
    wrapper.find('FeedEditForm').props().onRemove()
    await flushPromises()

    expect(wrapper.find('FeedEditForm').prop('changePending')).toEqual(false)
  })

  it('should redirect to feed list page when call to feedApi.deleteFeed succeeded', async () => {
    feedApi.deleteFeed = resolved()
    const wrapper = await createWrapper()
    wrapper.find('FeedEditForm').props().onRemove()
    await flushPromises()

    expect(props.historyReplace).toHaveBeenCalledWith({pathname: ADMIN_FEEDS_URL})
  })

  it('should trigger prop function "showErrorNotification" when call to feedApi.deleteFeed failed with HTTP 409', async () => {
    feedApi.deleteFeed = rejected({status: 409})
    const wrapper = await createWrapper()
    wrapper.find('FeedEditForm').props().onRemove()
    await flushPromises()

    expect(props.showErrorNotification).toHaveBeenCalledWith('Can not delete. Feed has subscriptions')
  })

  it('should trigger prop function "showErrorNotification" when call to feedApi.deleteFeed failed with HTTP !== 409', async () => {
    feedApi.deleteFeed = rejected({status: 400, data: 'expected error'})
    const wrapper = await createWrapper()
    wrapper.find('FeedEditForm').props().onRemove('1')
    await flushPromises()

    expect(props.showErrorNotification).toHaveBeenCalledWith('expected error')
  })
})
