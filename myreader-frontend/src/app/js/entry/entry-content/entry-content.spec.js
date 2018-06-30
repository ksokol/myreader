import React from 'react'
import {EntryContent} from './entry-content'
import {shallowOutput} from '../../shared/test-utils'

describe('src/app/js/entry/entry-content/entry-content.spec.js', () => {

    let item

    beforeEach(() => item = {content: 'expected content'})

    it('should set content as innerHTML', () => {
        expect(shallowOutput(<EntryContent {...item} />))
            .toEqual(<div className="my-entry-content" dangerouslySetInnerHTML={{__html: 'expected content'}}></div>)
    })
})
