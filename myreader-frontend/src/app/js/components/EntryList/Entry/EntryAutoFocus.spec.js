import React from 'react'
import {mount} from 'enzyme'
import {EntryAutoFocus} from './EntryAutoFocus'

/* eslint-disable react/prop-types */
jest.mock('./Entry', () =>({
  Entry: () => null
}))
/* eslint-enable */

describe('EntryAutoFocus', () => {

  let props, el

  beforeEach(() => {
    props = {
      focusUuid: '1',
      item: {
        uuid: '1',
        title: 'expected title',
        feedTitle: 'expected feedTitle',
        origin: 'expected origin',
        seen: true,
        createdAt: 'expected createdAt',
      },
      onChangeEntry: jest.fn()
    }

    el = {
      scrollIntoView: jest.fn()
    }
  })

  const createWrapper = () => {
    const wrapper = mount(<EntryAutoFocus {...props} />)
    wrapper.children().props().entryRef(el)
    wrapper.instance().componentDidUpdate()
    return wrapper
  }

  it('should pass expected props to child component', () => {
    const wrapper = createWrapper()
    const {entryRef, ...expectedProps} = props

    expect(wrapper.props()).toEqual(expectedProps)
  })

  it('should scroll to child component when prop "item.uuid" is equal to prop "focusUuid"', () => {
    createWrapper()

    expect(el.scrollIntoView).toHaveBeenCalledWith({behavior: 'smooth', block: 'start'})
  })

  it('should focus child component when prop "item.uuid" is equal to prop "focusUuid"', () => {
    expect(createWrapper().children().prop('className')).toEqual('my-entry--focus')
  })

  it('should not scroll a second time to child component when prop "item.uuid" is equal to prop "focusUuid"', () => {
    createWrapper().setProps({focusUuid: props.focusUuid})

    expect(el.scrollIntoView).toHaveReturnedTimes(1)
  })

  it('should not scroll to child component when prop "item.uuid" is not equal to prop "focusUuid"', () => {
    const wrapper = createWrapper()
    el.scrollIntoView.mockReset()
    wrapper.setProps({focusUuid: '2'})

    expect(el.scrollIntoView).not.toHaveBeenCalled()
  })

  it('should not focus child component when prop "item.uuid" is not equal to prop "focusUuid"', () => {
    const wrapper = createWrapper()
    wrapper.setProps({focusUuid: '2'})

    expect(wrapper.children().prop('className')).toBeUndefined()
  })
})
