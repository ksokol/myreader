import React from 'react'
import {EntryContent} from './entry-content'
import {shallow} from "../../shared/test-utils";

describe('src/app/js/entry/entry-content/entry-content.spec.js', () => {

    let item

    beforeEach(() => item = {content: 'expected content'})

    it('should set content as innerHTML', () => {
        expect(shallow(<EntryContent {...item} />))
            .toEqual(<div className="my-entry-content" dangerouslySetInnerHTML={{__html: 'expected content'}}></div>)
    })
})
