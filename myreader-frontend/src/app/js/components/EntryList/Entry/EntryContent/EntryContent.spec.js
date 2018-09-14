import React from 'react'
import {EntryContent} from './EntryContent'
import {shallow} from 'enzyme'

describe('src/app/js/components/EntryList/Entry/EntryContent/EntryContent.spec.js', () => {

  let item

  beforeEach(() => item = {content: 'expected content'})

  it('should set content as innerHTML', () => {
    const result = shallow(<EntryContent {...item} />)
      .matchesElement(<div className="my-entry-content" dangerouslySetInnerHTML={{__html: 'expected content'}} />)

    expect(result).toEqual(true)
  })
})
