import React from 'react'
import Entry from './entry'
import {shallow, mount} from 'enzyme'
import {EntryActions} from './EntryActions/EntryActions'
import EntryTags from './EntryTags/EntryTags'
import {EntryTitle} from './EntryTitle/EntryTitle'
import {EntryContent} from './entry-content/entry-content'

class EntryPage {

  constructor(wrapper) {
    this.wrapper = wrapper
  }

  setProps(props) {
    this.wrapper.setProps(props)
  }

  entryTitle() {
    return this.wrapper.find(EntryTitle)
  }

  entryActions() {
    return this.wrapper.find(EntryActions)
  }

  entryTags() {
    return this.wrapper.find(EntryTags)
  }

  entryContent() {
    return this.wrapper.find(EntryContent)
  }
}

describe('src/app/js/components/entry-list/entry/entry.spec.js', () => {

  let props, page

  beforeEach(() => {
    props = {
      item: {
        uuid: 'expected uuid',
        title: 'expected title',
        feedTitle: 'expected feedTitle',
        tag: 'expected tag',
        origin: 'expected origin',
        seen: false,
        createdAt: 'expected createdAt',
        content: 'expected content',
      },
      showEntryDetails: false,
      isDesktop: true,
      onChangeEntry: jest.fn(),
      entryRef: jest.fn()
    }

    page = new EntryPage(shallow(<Entry {...props} />))
  })

  it('should propagate item to child components', () => {
    page.entryActions().props().onToggleShowMore()

    expect(page.entryTitle().props()).toContainObject({
      title: props.item.title,
      feedTitle: props.item.feedTitle,
      origin: props.item.origin,
      createdAt: props.item.createdAt
    })
    expect(page.entryActions().props()).toContainObject({seen: props.item.seen})
    expect(page.entryTags().props()).toContainObject({tags: props.item.tag})
    expect(page.entryContent().props()).toEqual({content: props.item.content})
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
    page.entryTags().props().onChange('tag1')

    expect(props.onChangeEntry).toHaveBeenCalledWith({
      seen: false,
      tag: 'tag1',
      uuid: 'expected uuid'
    })
  })

  it('should trigger prop "entryRef" function with entry ref as argument', done => {
    props.entryRef = actualRef => {
      expect(actualRef.classList.toString()).toEqual('my-entry')
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

  it('should not render tags and content on tablet and phone', () => {
    page.setProps({isDesktop: false, showEntryDetails: false})

    expect(page.entryTags().exists()).toEqual(false)
    expect(page.entryContent().exists()).toEqual(false)
  })

  it('should render tags and content on tablet and phone when show more toggle triggered', () => {
    page.setProps({isDesktop: false, showEntryDetails: false})
    page.entryActions().props().onToggleShowMore()

    expect(page.entryTags().exists()).toEqual(true)
    expect(page.entryContent().exists()).toEqual(true)
  })

  it('should toggle visibility of tags and content on tablet and phone when show more toggle triggered', () => {
    page.setProps({isDesktop: false, showEntryDetails: false})
    page.entryActions().props().onToggleShowMore()
    page.entryActions().props().onToggleShowMore()

    expect(page.entryTags().exists()).toEqual(false)
    expect(page.entryContent().exists()).toEqual(false)
  })

  it('should not render tags and content on desktop when entry details visibility is turned off', () => {
    page.setProps({isDesktop: true, showEntryDetails: false})

    expect(page.entryTags().exists()).toEqual(false)
    expect(page.entryContent().exists()).toEqual(false)
  })

  it('should render tags and content on desktop when entry details visibility is turned off but show more toggle triggered', () => {
    page.setProps({isDesktop: true, showEntryDetails: false})
    page.entryActions().props().onToggleShowMore()

    expect(page.entryTags().exists()).toEqual(true)
    expect(page.entryContent().exists()).toEqual(true)
  })

  it('should toggle visibility of tags and content on desktop when entry details visibility is turned off but show more toggle triggered', () => {
    page.setProps({isDesktop: true, showEntryDetails: false})
    page.entryActions().props().onToggleShowMore()
    page.entryActions().props().onToggleShowMore()

    expect(page.entryTags().exists()).toEqual(false)
    expect(page.entryContent().exists()).toEqual(false)
  })

  it('should not render tags and content on phone and tablet despite entry details visibility is turned on', () => {
    page.setProps({isDesktop: false, showEntryDetails: true})

    expect(page.entryTags().exists()).toEqual(false)
    expect(page.entryContent().exists()).toEqual(false)
  })

  it('should render tags and content on phone and tablet when entry details visibility is turned on and show more toggle triggered', () => {
    page.setProps({isDesktop: false, showEntryDetails: true})
    page.entryActions().props().onToggleShowMore()

    expect(page.entryTags().exists()).toEqual(true)
    expect(page.entryContent().exists()).toEqual(true)
  })

  it('should toggle visibility of tags and content on phone and tablet ignoring entry details visibility setting when show more toggle triggered', () => {
    page.setProps({isDesktop: false, showEntryDetails: true})
    page.entryActions().props().onToggleShowMore()
    page.entryActions().props().onToggleShowMore()

    expect(page.entryTags().exists()).toEqual(false)
    expect(page.entryContent().exists()).toEqual(false)
  })

  it('should render content without tags on desktop', () => {
    page.setProps({isDesktop: true, showEntryDetails: true})

    expect(page.entryTags().exists()).toEqual(false)
    expect(page.entryContent().exists()).toEqual(true)
  })

  it('should render tags and content on desktop when show more toggle triggered', () => {
    page.setProps({isDesktop: true, showEntryDetails: true})
    page.entryActions().props().onToggleShowMore()

    expect(page.entryTags().exists()).toEqual(true)
    expect(page.entryContent().exists()).toEqual(true)
  })

  it('should toggle visibility of tags on desktop when show more toggle triggered', () => {
    page.setProps({isDesktop: true, showEntryDetails: true})
    page.entryActions().props().onToggleShowMore()
    page.entryActions().props().onToggleShowMore()

    expect(page.entryTags().exists()).toEqual(false)
    expect(page.entryContent().exists()).toEqual(true)
  })
})
