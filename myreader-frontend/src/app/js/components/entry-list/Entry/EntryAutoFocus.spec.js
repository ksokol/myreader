import React from 'react'
import {shallow} from '../../../shared/test-utils'
import EntryAutoFocus from './EntryAutoFocus'

describe('src/app/js/components/entry-list/Entry/EntryAutoFocus.spec.js', () => {

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

  const renderShallow = () => {
    const rendered = shallow(<EntryAutoFocus {...props} />)
    rendered.output().props.entryRef(el)
    rendered.instance.componentDidUpdate()
    return rendered
  }

  it('should pass expected props to child component', () => {
    const {output} = renderShallow()
    const {entryRef, focusUuid, ...expectedProps} = props

    expect(output().props).toContainObject(expectedProps)
  })

  it('should scroll to child component when prop "item.uuid" is equal to prop "focusUuid"', () => {
    renderShallow()

    expect(el.scrollIntoView).toHaveBeenCalledWith({behavior: 'smooth', block: 'start'})
  })

  it('should focus child component when prop "item.uuid" is equal to prop "focusUuid"', () => {
    const {output} = renderShallow()

    expect(output().props.className).toEqual('my-entry--focus')
  })

  it('should not scroll a second time to child component when prop "item.uuid" is equal to prop "focusUuid"', () => {
    const {output, rerender, instance} = renderShallow()

    rerender()
    instance.componentDidUpdate()

    expect(el.scrollIntoView).toHaveReturnedTimes(1)
    expect(output().props.className).toEqual('my-entry--focus')
  })

  it('should not scroll to child component when prop "item.uuid" is not equal to prop "focusUuid"', () => {
    props.focusUuid = '2'
    renderShallow()

    expect(el.scrollIntoView).not.toHaveBeenCalled()
  })

  it('should not focus child component when prop "item.uuid" is not equal to prop "focusUuid"', () => {
    props.focusUuid = '2'
    const {output} = renderShallow()

    expect(output().props.className).toBeUndefined()
  })
})
