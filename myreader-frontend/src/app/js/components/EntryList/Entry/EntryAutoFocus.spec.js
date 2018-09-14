import React from 'react'
import EntryAutoFocus from './EntryAutoFocus'
import {mount} from 'enzyme'

describe('src/app/js/components/EntryList/Entry/EntryAutoFocus.spec.js', () => {

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
      showEntryDetails: true,
      isDesktop: true,
      onChangeEntry: jest.fn()
    }

    el = {
      scrollIntoView: jest.fn()
    }
  })

  const createMount = () => {
    const wrapper = mount(<EntryAutoFocus {...props} />)
    wrapper.children().props().entryRef(el)
    wrapper.instance().componentDidUpdate()
    return wrapper
  }

  it('should pass expected props to child component', () => {
    const wrapper = createMount()
    const {entryRef, focusUuid, ...expectedProps} = props

    expect(wrapper.props()).toContainObject(expectedProps)
  })

  it('should scroll to child component when prop "item.uuid" is equal to prop "focusUuid"', () => {
    createMount()

    expect(el.scrollIntoView).toHaveBeenCalledWith({behavior: 'smooth', block: 'start'})
  })

  it('should focus child component when prop "item.uuid" is equal to prop "focusUuid"', () => {
    expect(createMount().children().prop('className')).toEqual('my-entry--focus')
  })

  it('should not scroll a second time to child component when prop "item.uuid" is equal to prop "focusUuid"', () => {
    createMount().setProps({focusUuid: props.focusUuid})

    expect(el.scrollIntoView).toHaveReturnedTimes(1)
  })

  it('should not scroll to child component when prop "item.uuid" is not equal to prop "focusUuid"', () => {
    const wrapper = createMount()
    el.scrollIntoView.mockReset()
    wrapper.setProps({focusUuid: '2'})

    expect(el.scrollIntoView).not.toHaveBeenCalled()
  })

  it('should not focus child component when prop "item.uuid" is not equal to prop "focusUuid"', () => {
    const wrapper = createMount()
    wrapper.setProps({focusUuid: '2'})

    expect(wrapper.children().prop('className')).toBeUndefined()
  })
})
