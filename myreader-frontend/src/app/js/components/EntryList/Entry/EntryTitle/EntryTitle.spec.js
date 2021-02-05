import React from 'react'
import {EntryTitle} from './EntryTitle'
import {Badge} from '../../..'
import {shallow} from 'enzyme'
import {TimeAgo} from '../../../TimeAgo/TimeAgo'

describe('EntryTitle', () => {

  let entry

  beforeEach(() => {
    entry = {
      title: 'entry title',
      origin: 'entry url',
      createdAt: 'entry created date',
      feedTitle: 'feed title'
    }
  })

  const createShallow = () => shallow(<EntryTitle entry={entry} />)

  const reduceSubTitle = (value, node) => {
    if (node.is('span')) {
      return `${value}${node.children().reduce(reduceSubTitle, '')}`
    }
    if (node.is(TimeAgo)) {
      return `${value}${node.prop('date')}`
    }
    if (node.is(Badge)) {
      return `${value} ${node.prop('text')} ${node.prop('color')}`
    }
    return `${value}${node.text()}`
  }

  it('should render entry title', () => {
    const wrapper = createShallow()

    expect(wrapper.at(0).children().text()).toEqual(entry.title)
  })

  it('should render feed title', () => {
    const wrapper = createShallow()
    const result = wrapper.at(1).children().reduce(reduceSubTitle, '')

    expect(result).toEqual('entry created date on feed title')
  })

  it('should open entry url in new window safely', () => {
    const wrapper = createShallow()

    expect(wrapper.at(0).props()).toMatchObject({
      href: entry.origin,
      rel: 'noopener noreferrer',
      target: '_blank'
    })
  })

  it('should render feedTag and feedTagColor when defined', () => {
    entry = {
      ...entry,
      feedTag: 'tag',
      feedTagColor: 'color'
    }

    const wrapper = createShallow()
    const result = wrapper.at(1).children().reduce(reduceSubTitle, '')

    expect(result).toEqual('entry created date on feed title tag color')
  })
})
