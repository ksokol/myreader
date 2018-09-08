import React from 'react'
import {EntryTitle} from './entry-title'
import {shallow} from '../../../../shared/test-utils'
import {TimeAgo} from '../../..'

describe('src/app/js/components/entry-list/entry/entry-title/entry-title.spec.js', () => {

  let item, component

  beforeEach(() => {
    item = {
      title: 'entry title',
      origin: 'entry url',
      createdAt: 'entry created date',
      feedTitle: 'feed title'
    }

    component = <EntryTitle {...item} />
  })

  const renderShallow = () => shallow(component)

  it('should render entry title', () => {
    const {output} = renderShallow(component)

    expect(output()[0].type).toEqual('a')
    expect(output()[0].props.children).toEqual(item.title)
  })

  it('should render feed title', () => {
    const {output} = renderShallow(component)

    expect(output()[1].type).toEqual('span')
    expect(output()[1].props.children)
      .toEqual([<TimeAgo date={item.createdAt}/>, ' on ', item.feedTitle]) // eslint-disable-line
  })

  it('should open entry url in new window safely', () => {
    const {output} = renderShallow(component)

    expect(output()[0].props).toMatchObject({
      href: item.origin,
      rel: 'noopener noreferrer',
      target: '_blank'
    })
  })
})
