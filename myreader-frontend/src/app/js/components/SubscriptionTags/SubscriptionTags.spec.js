import React from 'react'
import {shallow} from 'enzyme'
import SubscriptionTags from './SubscriptionTags'
import SubscriptionTagColorPicker from './SubscriptionTagColorPicker/SubscriptionTagColorPicker'

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
      click: item.children().at(1).props().onClick
    }
  }

  get colorPicker() {
    const item = this.wrapper.find(SubscriptionTagColorPicker)

    return {
      exists: () => item.exists(),
      props: () => item.props(),
      onClose: () => item.props().onClose(),
      onSave: arg => item.props().onSave(arg),
    }
  }
}

describe('SubscriptionTags', () => {

  let props, page

  beforeEach(() => {
    props = {
      subscriptionTags: [
        {uuid: 'uuid1', name: 'name1', color: 'color1'},
        {uuid: 'uuid2', name: 'name2', color: null}
      ],
      onChange: jest.fn()
    }

    page = new SubscriptionTagsPage(shallow(<SubscriptionTags {...props} />))
  })

  it('should render tags with expected props', () => {
    expect(page.tagAt(0)).toContainObject({
      key: 'uuid1',
      title: 'name1',
      style: {backgroundColor: 'color1'}
    })
    expect(page.tagAt(1)).toContainObject({
      key: 'uuid2',
      title: 'name2',
      style: {backgroundColor: null}
    })
  })

  it('should not show color picker', () => {
    expect(page.colorPicker.exists()).toEqual(false)
  })

  it('should render color picker for tag with uuid "uuid1"', () => {
    page.tagAt(0).click()

    expect(page.colorPicker.props()).toContainObject({
      tag: {uuid: 'uuid1', name: 'name1', color: 'color1'}
    })
  })

  it('should render color picker for tag with uuid "uuid2"', () => {
    page.tagAt(1).click()

    expect(page.colorPicker.props()).toContainObject({
      tag: {uuid: 'uuid2', name: 'name2', color: null}
    })
  })

  it('should not render color picker when color picker closed', () => {
    page.tagAt(1).click()
    page.colorPicker.onClose()

    expect(page.colorPicker.exists()).toEqual(false)
  })

  it('should trigger prop function "onChange" when color picked', () => {
    page.tagAt(1).click()
    page.colorPicker.onSave('expected color')

    expect(props.onChange).toHaveBeenCalledWith({
      uuid: 'uuid2',
      name: 'name2',
      color: 'expected color'
    })
  })
})
