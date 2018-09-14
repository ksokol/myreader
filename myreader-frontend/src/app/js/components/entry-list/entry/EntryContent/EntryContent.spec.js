import React from 'react'
import {EntryContent} from './EntryContent'
import {shallow} from '../../../../shared/test-utils'

describe('src/app/js/components/entry-list/entry/EntryContent/EntryContent.spec.js', () => {

  let item

  beforeEach(() => item = {content: 'expected content'})

  it('should set content as innerHTML', () => {
    const {output} = shallow(<EntryContent {...item} />)

    expect(output()).toEqual(<div className="my-entry-content" dangerouslySetInnerHTML={{__html: 'expected content'}}></div>)
  })
})
