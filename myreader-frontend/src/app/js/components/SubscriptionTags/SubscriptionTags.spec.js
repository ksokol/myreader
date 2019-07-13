import React from 'react'
import {mount} from 'enzyme'
import {SubscriptionTags} from './SubscriptionTags'
import {subscriptionTagsApi} from './../../api'
import {toast} from '../Toast'
import {flushPromises, resolved, pending, rejected} from '../../shared/test-utils'

/* eslint-disable react/prop-types */
jest.mock('./SubscriptionTagColorPicker/SubscriptionTagColorPicker', () => ({
  SubscriptionTagColorPicker: () => null
}))

jest.mock('../../api', () => ({
  subscriptionTagsApi: {}
}))

jest.mock('..//Toast', () => ({
  toast: jest.fn()
}))
/* eslint-enable */

const expectedError = 'expected error'

class SubscriptionTagsPage {

  constructor(wrapper) {
    this.wrapper = wrapper
  }

  tagAt(index) {
    const item = this.wrapper.find('li').at(index)

    return {
      key: item.key(),
      title: item.children().at(0).text(),
      style: item.children().at(1).prop('style'),
      click: () => {
        item.children().at(1).props().onClick()
        this.wrapper.update()
      }
    }
  }

  get colorPicker() {
    const item = this.wrapper.find('SubscriptionTagColorPicker')

    return {
      exists: () => item.exists(),
      props: () => item.props(),
      onClose: () => {
        item.props().onClose()
        this.wrapper.update()
      },
      onSave: arg => {
        item.props().onSave(arg)
        this.wrapper.update()
      }
    }
  }
}

describe('SubscriptionTags', () => {

  let subscriptionTags

  const createPage = async (onMount = resolved({content: subscriptionTags})) => {
    subscriptionTagsApi.fetchSubscriptionTags = onMount
    const wrapper = mount(<SubscriptionTags />)
    await flushPromises()
    wrapper.update()
    return new SubscriptionTagsPage(wrapper)
  }

  beforeEach(() => {
    subscriptionTags = [
      {uuid: 'uuid1', name: 'name1', color: 'color1'},
      {uuid: 'uuid2', name: 'name2', color: null}
    ]
  })

  it('should render tags when call to subscriptionTagsApi.fetchSubscriptionTags succeeded', async () => {
    const page = await createPage()

    expect(page.tagAt(0)).toEqual(expect.objectContaining({
      key: 'uuid1',
      title: 'name1',
      style: {backgroundColor: 'color1'}
    }))
    expect(page.tagAt(1)).toEqual(expect.objectContaining({
      key: 'uuid2',
      title: 'name2',
      style: {backgroundColor: null}
    }))
  })

  it('should show toast when call to subscriptionTagsApi.fetchSubscriptionTags failed', async () => {
    await createPage(rejected(expectedError))

    expect(toast).toHaveBeenCalledWith(expectedError, {error: true})
  })

  it('should not show color picker', async () => {
    const page = await createPage()

    expect(page.colorPicker.exists()).toEqual(false)
  })

  it('should render color picker for tag with uuid "uuid1"', async () => {
    const page = await createPage()
    page.tagAt(0).click()

    expect(page.colorPicker.props()).toEqual(expect.objectContaining({
      tag: {uuid: 'uuid1',
        name: 'name1',
        color: 'color1'
      }
    }))
  })

  it('should render color picker for tag with uuid "uuid2"', async () => {
    const page = await createPage()
    page.tagAt(1).click()

    expect(page.colorPicker.props()).toEqual(expect.objectContaining({
      tag: {
        uuid: 'uuid2',
        name: 'name2',
        color: null
      }
    }))
  })

  it('should not render color picker when color picker closed', async () => {
    const page = await createPage()
    page.tagAt(1).click()
    page.colorPicker.onClose()

    expect(page.colorPicker.exists()).toEqual(false)
  })

  it('should trigger subscriptionTagsApi.saveSubscriptionTag when color picked', async () => {
    const expectedColor = 'expected color'
    subscriptionTagsApi.saveSubscriptionTag = pending()
    const page = await createPage()
    page.tagAt(1).click()
    page.colorPicker.onSave(expectedColor)
    await flushPromises()

    expect(subscriptionTagsApi.saveSubscriptionTag).toHaveBeenCalledWith({
      uuid: 'uuid2',
      name: 'name2',
      color: expectedColor
    })
  })

  it('should show toast when call to subscriptionTagsApi.saveSubscriptionTag failed', async () => {
    subscriptionTagsApi.saveSubscriptionTag = rejected(expectedError)
    const page = await createPage()
    page.tagAt(1).click()
    page.colorPicker.onSave()
    await flushPromises()

    expect(toast).toHaveBeenCalledWith(expectedError, {error: true})
  })

  it('should show toast when call to subscriptionTagsApi.saveSubscriptionTag succeeded', async () => {
    subscriptionTagsApi.saveSubscriptionTag = resolved({})
    const page = await createPage()
    page.tagAt(1).click()
    page.colorPicker.onSave()
    await flushPromises()

    expect(toast).toHaveBeenCalledWith('Tag updated')
  })

  it('should show updated tags when call to subscriptionTagsApi.saveSubscriptionTag succeeded', async () => {
    const expectedColor = 'expectedColor'
    subscriptionTagsApi.saveSubscriptionTag = resolved({uuid: 'uuid2', color: expectedColor})
    const page = await createPage()
    page.tagAt(1).click()
    page.colorPicker.onSave()
    await flushPromises()
    page.wrapper.update()

    expect(page.tagAt(0)).toEqual(expect.objectContaining({
      key: 'uuid1',
      style: {backgroundColor: 'color1'}
    }))
    expect(page.tagAt(1)).toEqual(expect.objectContaining({
      key: 'uuid2',
      style: {
        backgroundColor: expectedColor
      }
    }))
  })
})
