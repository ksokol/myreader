import React from 'react'
import {shallow, mount} from 'enzyme'
import {Entry} from './Entry'

/* eslint-disable react/prop-types */
jest.mock('./EntryContent/EntryContent', () => ({
  EntryContent: () => null
}))
/* eslint-enable */

class EntryPage {

  constructor(wrapper) {
    this.wrapper = wrapper
  }

  setProps(props) {
    this.wrapper.setProps(props)
  }

  entryTitle() {
    return this.wrapper.find('EntryTitle')
  }

  entryActions() {
    return this.wrapper.find('EntryActions')
  }

  entryTags() {
    return this.wrapper.find('EntryTags')
  }

  entryContent() {
    return this.wrapper.find('EntryContent')
  }
}

describe('Entry', () => {

  let props, page

  beforeEach(() => {
    props = {
      item: {
        uuid: 'expected uuid',
        title: 'expected title',
        feedTitle: 'expected feedTitle',
        tags: ['expected tag'],
        origin: 'expected origin',
        seen: false,
        createdAt: 'expected createdAt',
        content: 'expected content',
        feedTag: 'tag'
      },
      onChangeEntry: jest.fn(),
      entryRef: jest.fn()
    }

    page = new EntryPage(shallow(<Entry {...props} />))
  })

  it('should propagate props to child components', () => {
    page.entryActions().props().onToggleShowMore()

    expect(page.entryTitle().props()).toEqual({
      entry: {
        title: props.item.title,
        feedTitle: props.item.feedTitle,
        origin: props.item.origin,
        createdAt: props.item.createdAt,
        feedTag: props.item.feedTag,
        content: props.item.content,
        seen: props.item.seen,
        tags: props.item.tags,
        uuid: props.item.uuid
      }
    })
    expect(page.entryActions().props()).toEqual(expect.objectContaining({
      seen: props.item.seen
    }))
    expect(page.entryTags().props()).toEqual(expect.objectContaining({
      tags: props.item.tags
    }))
    expect(page.entryContent().props()).toEqual(expect.objectContaining({
      content: props.item.content
    }))
  })

  it('should pass expected prop "showMore" to entry actions', () => {
    page.entryActions().props().onToggleShowMore()
    expect(page.entryActions().props().showMore).toEqual(true)

    page.entryActions().props().onToggleShowMore()
    expect(page.entryActions().props().showMore).toEqual(false)
  })

  it('should trigger prop function "onChangeEntry" when entry actions prop function "onToggleSeen" called', () => {
    page.entryActions().props().onToggleSeen()

    expect(props.onChangeEntry).toHaveBeenCalledWith({...props.item, seen: !props.item.seen})
  })

  it('should trigger prop function "onChangeEntry" when entry tags prop function "onChange" called', () => {
    page.entryActions().props().onToggleShowMore()
    page.entryTags().props().onChange(['tag1'])

    expect(props.onChangeEntry).toHaveBeenCalledWith({
      seen: false,
      tags: ['tag1'],
      uuid: 'expected uuid'
    })
  })

  it('should trigger prop "entryRef" function with entry ref as argument', done => {
    props.entryRef = actualRef => {
      expect(actualRef.classList.toString()).toContain('my-entry')
      done()
    }

    mount(<Entry {...props} />)
  })

  it('should append prop "className" to entry ref classList', done => {
    props.className = 'expected-class'
    props.entryRef = actualRef => {
      expect(actualRef.classList.toString()).toEqual('my-entry expected-class')
      done()
    }

    mount(<Entry {...props} />)
  })

  it('should not render tags and content component when mounted', () => {
    expect(page.entryTags().exists()).toEqual(false)
    expect(page.entryContent().prop('maybeVisible')).toEqual(false)
  })

  it('should render tags and content component when show more toggle triggered', () => {
    page.entryActions().props().onToggleShowMore()

    expect(page.entryTags().exists()).toEqual(true)
    expect(page.entryContent().exists()).toEqual(true)
  })

  it('should hide tags and content component when show more toggle triggered a second time', () => {
    page.entryActions().props().onToggleShowMore()
    page.entryActions().props().onToggleShowMore()

    expect(page.entryTags().exists()).toEqual(false)
    expect(page.entryContent().prop('maybeVisible')).toEqual(false)
  })
})
