import React from 'react'
import {EntryTitle} from './EntryTitle'
import {TimeAgo} from '../../..'
import {shallow} from 'enzyme'

describe('src/app/js/components/entry-list/entry/EntryTitle/EntryTitle.spec.js', () => {

  let item

  beforeEach(() => {
    item = {
      title: 'entry title',
      origin: 'entry url',
      createdAt: 'entry created date',
      feedTitle: 'feed title'
    }
  })

  const createShallow = () => shallow(<EntryTitle {...item} />)

  it('should render entry title', () => {
    const wrapper = createShallow()

    expect(wrapper.at(0).type()).toEqual('a')
    expect(wrapper.at(0).children().text()).toEqual(item.title)
  })

  it('should render feed title', () => {
    const wrapper = createShallow()
    const result = wrapper
      .at(1)
      .children()
      .reduce((value, node) => node.is(TimeAgo) ? `${value}${node.prop('date')}` : `${value}${node.text()}`, '')

    expect(wrapper.at(1).type()).toEqual('span')
    expect(result).toEqual('entry created date on feed title')
  })

  it('should open entry url in new window safely', () => {
    const wrapper = createShallow()

    expect(wrapper.at(0).props()).toMatchObject({
      href: item.origin,
      rel: 'noopener noreferrer',
      target: '_blank'
    })
  })
})
