import React from 'react'
import {EntryTitle} from './entry-title'
import {shallowOutput} from '../../shared/test-utils'
import {TimeAgo} from '../../shared/time-ago/time-ago'

describe('src/app/js/entry/entry-title/entry-title.spec.js', () => {

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

    it('should render entry title', () => {
        expect(shallowOutput(component)[0].type).toEqual('a')
        expect(shallowOutput(component)[0].props.children).toEqual(item.title)
    })

    it('should render feed title', () => {
        expect(shallowOutput(component)[1].type).toEqual('span')
        expect(shallowOutput(component)[1].props.children)
            .toEqual([<TimeAgo date={item.createdAt} />, ' on ', item.feedTitle]) // eslint-disable-line
    })

    it('should open entry url in new window safely', () => {
        expect(shallowOutput(component)[0].props).toMatchObject({
            href: item.origin,
            rel: 'noopener noreferrer',
            target: '_blank'
        })
    })
})
