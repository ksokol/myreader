import React from 'react'
import {mount} from 'enzyme'
import SubscribePage from './SubscribePage'
import {SUBSCRIPTION_URL} from '../../constants'
import {subscriptionApi} from '../../api'
import {flushPromises, rejected, resolved} from '../../shared/test-utils'

/* eslint-disable react/prop-types */
jest.mock('../../components', () => ({
  SubscribeForm: () => null
}))

jest.mock('../../contexts', () => ({
  withLocationState: Component => Component,
  withNotification: Component => Component
}))

jest.mock('../../api', () => ({
  subscriptionApi: {}
}))
/* eslint-enable */

describe('SubscribePage', () => {

  let props

  const createWrapper = () => mount(<SubscribePage {...props} />)

  beforeEach(() => {
    props = {
      historyReplace: jest.fn(),
      showSuccessNotification: jest.fn(),
      showErrorNotification: jest.fn()
    }
  })

  it('should pass expected props to component', () => {
    expect(createWrapper().find('SubscribeForm').props()).toEqual(expect.objectContaining({
      changePending: false,
      validations: []
    }))
  })

  it('should call subscriptionApi.subscribe when prop function "saveSubscribeEditForm" called', () => {
    subscriptionApi.subscribe = resolved()
    createWrapper().find('SubscribeForm').props().saveSubscribeEditForm({origin: 'url'})

    expect(subscriptionApi.subscribe).toHaveBeenCalledWith({
      origin: 'url'
    })
  })

  it('should set prop "changePending" to true when subscriptionApi.subscribe called', async () => {
    subscriptionApi.subscribe = resolved({uuid: 'uuid1'})
    const wrapper = createWrapper()
    wrapper.find('SubscribeForm').props().saveSubscribeEditForm({})
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('SubscribeForm').prop('changePending')).toEqual(true)
  })

  it('should trigger prop function "showSuccessNotification" when prop call to subscriptionApi.subscribe succeeded', async () => {
    subscriptionApi.subscribe = resolved()
    const wrapper = createWrapper()
    wrapper.find('SubscribeForm').props().saveSubscribeEditForm({})
    await flushPromises()
    wrapper.update()

    expect(props.showSuccessNotification).toHaveBeenCalledWith('Subscribed')
  })

  it('should redirect to feed detail page when call to subscriptionApi.subscribe succeeded', async () => {
    subscriptionApi.subscribe = resolved({uuid: 'uuid1'})
    const wrapper = createWrapper()
    wrapper.find('SubscribeForm').props().saveSubscribeEditForm({})
    await flushPromises()
    wrapper.update()

    expect(props.historyReplace).toHaveBeenCalledWith({
      pathname: SUBSCRIPTION_URL,
      params: {
        uuid: 'uuid1'
      }
    })
  })

  it('should pass state "validations" to feed edit page when call to subscriptionApi.subscribe failed', async () => {
    subscriptionApi.subscribe = rejected({status: 400, data: {fieldErrors: ['error']}})
    const wrapper = createWrapper()
    wrapper.find('SubscribeForm').props().saveSubscribeEditForm({})
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('SubscribeForm').prop('validations')).toEqual(['error'])
  })

  it('should clear state "validations" when subscriptionApi.subscribe called again', async () => {
    subscriptionApi.subscribe = rejected({status: 400, data: {fieldErrors: ['error']}})
    const wrapper = createWrapper()
    wrapper.find('SubscribeForm').props().saveSubscribeEditForm({})
    await flushPromises()
    wrapper.find('SubscribeForm').props().saveSubscribeEditForm({})
    wrapper.update()

    expect(wrapper.find('SubscribeForm').prop('validations')).toEqual([])
  })

  it('should not pass state "validations" to feed edit page when call to subscriptionApi.subscribe failed', async () => {
    subscriptionApi.subscribe = rejected({status: 401, data: {fieldErrors: ['error']}})
    const wrapper = createWrapper()
    wrapper.find('SubscribeForm').props().saveSubscribeEditForm({})
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('SubscribeForm').prop('validations')).toEqual([])
  })

  it('should set prop "changePending" to false when call to subscriptionApi.subscribe failed', async () => {
    subscriptionApi.subscribe = rejected()
    const wrapper = createWrapper()
    wrapper.find('SubscribeForm').props().saveSubscribeEditForm({})
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('SubscribeForm').prop('changePending')).toEqual(false)
  })

  it('should trigger prop function "props.showErrorNotification" when call to subscriptionApi.subscribe failed with HTTP != 400', async () => {
    subscriptionApi.subscribe = rejected({data: 'expected error'})
    const wrapper = createWrapper()
    wrapper.find('SubscribeForm').props().saveSubscribeEditForm({})
    await flushPromises()
    wrapper.update()

    expect(props.showErrorNotification).toHaveBeenCalledWith('expected error')
  })

  it('should not trigger prop function "props.showErrorNotification" when call to subscriptionApi.subscribe failed with HTTP == 400', async () => {
    subscriptionApi.subscribe = rejected({status: 400, data: {fieldErrors: ['error']}})
    const wrapper = createWrapper()
    wrapper.find('SubscribeForm').props().saveSubscribeEditForm({})
    await flushPromises()
    wrapper.update()

    expect(props.showErrorNotification).not.toHaveBeenCalled()
  })
})
