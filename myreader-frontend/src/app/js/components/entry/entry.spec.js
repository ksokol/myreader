import React from 'react'
import Entry from './entry'
import {shallow} from '../../shared/test-utils'
import ReactTestUtils from 'react-dom/test-utils'

class EntryPage {

  constructor({output}) {
    this.output = output
  }

  entryHeader() {
    return this.output().props.children[0].props.children
  }

  entryTitle() {
    return this.entryHeader()[0].props.children
  }

  entryActions() {
    return this.entryHeader()[1].props.children
  }

  entryTags() {
    return this.output().props.children[1]
  }

  entryContent() {
    return this.output().props.children[2]
  }
}

describe('src/app/js/components/entry/entry.spec.js', () => {

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
      onChange: jest.fn(),
      entryRef: jest.fn()
    }

    page = new EntryPage(shallow(<Entry {...props} />))
  })

  it('should propagate item to child components', () => {
    page.entryActions().props.onToggleShowMore()

    expect(page.entryTitle().props).toContainObject({
      title: props.item.title,
      feedTitle: props.item.feedTitle,
      origin: props.item.origin,
      createdAt: props.item.createdAt
    })
    expect(page.entryActions().props).toContainObject({seen: props.item.seen})
    expect(page.entryTags().props).toContainObject({tags: props.item.tag})
    expect(page.entryContent().props).toEqual({content: props.item.content})
  })

  it('should show or hide entryTags component based on showMore flag', () => {
    page.entryActions().props.onToggleShowMore()
    expect(page.entryTags()).toBeDefined()

    page.entryActions().props.onToggleShowMore()
    expect(page.entryTags()).toEqual(false)
  })

  it('should show or hide entryContent component based on showMore flag', () => {
    props.isDesktop = false
    page.entryActions().props.onToggleShowMore()

    expect(page.entryContent()).toBeDefined()

    page.entryActions().props.onToggleShowMore()

    expect(page.entryContent()).toEqual(false)
  })

  it('should update seen flag when entryActions component fired myOnCheck event', () => {
    page.entryActions().props.onToggleSeen()

    expect(props.onChange).toHaveBeenCalledWith({...props.item, seen: !props.item.seen})
  })

  it('should update tag when entryTags component fired onSelect event', () => {
    page.entryActions().props.onToggleShowMore()
    page.entryTags().props.onChange('tag1')

    expect(props.onChange).toHaveBeenCalledWith({
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

    ReactTestUtils.renderIntoDocument(<Entry {...props} />)
  })

  it('should append prop "className" to entry ref classList', done => {
    props.className = 'expected-class'
    props.entryRef = actualRef => {
      expect(actualRef.classList.toString()).toEqual('my-entry expected-class')
      done()
    }

    ReactTestUtils.renderIntoDocument(<Entry {...props} />)
  })

  describe('showContent', () => {

    describe('with showMore set to false', () => {

      beforeEach(() => props.showMore = false)

      it('should return false when showEntryDetails is false and media breakpoint is not of type desktop', () => {
        props.isDesktop = false

        expect(page.entryContent()).toEqual(false)
      })

      it('should return false when showEntryDetails is true and media breakpoint is not of type desktop', () => {
        props.isDesktop = false
        props.showMore = true

        expect(page.entryContent()).toEqual(false)
      })

      it('should return false when showEntryDetails is false and media breakpoint is of type desktop', () => {
        props.isDesktop = true

        expect(page.entryContent()).toEqual(false)
      })

      it('should return true when showEntryDetails is true and media breakpoint is of type desktop', () => {
        props.isDesktop = true
        props.showMore = true

        expect(page.entryContent()).toBeDefined()
      })
    })

    describe('with showMore set to true', () => {

      beforeEach(() => props.showMore = true)

      it('should return true when showEntryDetails and media breakpoint is not of type desktop', () => {
        props.isDesktop = false
        props.showMore = false

        expect(page.entryContent()).toBeDefined()
      })

      it('should return true when showEntryDetails is true and media breakpoint is not of type desktop', () => {
        props.isDesktop = false

        expect(page.entryContent()).toBeDefined()
      })

      it('should return true when showEntryDetails is false and media breakpoint is of type desktop', () => {
        props.isDesktop = true
        props.showMore = false

        expect(page.entryContent()).toBeDefined()
      })

      it('should return true when showEntryDetails is true and media breakpoint is of type desktop', () => {
        props.isDesktop = true

        expect(page.entryContent()).toBeDefined()
      })
    })
  })
})
