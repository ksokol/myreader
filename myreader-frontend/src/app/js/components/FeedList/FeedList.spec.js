import React from 'react'
import {shallow} from 'enzyme'
import FeedList from './FeedList'

describe('FeedList', () => {

  let props

  const createComponent = () => shallow(<FeedList {...props} />)

  beforeEach(() => {
    props= {
      feeds: [
        {uuid: '1', title: '1', hasErrors: false, createdAt: '1'},
        {uuid: '2', title: '2', hasErrors: true, createdAt: '2'}
      ]
    }
  })

  it('should not render exclamation icon when first feed has no errors', () => {
    expect(createComponent().children().at(0).find('[type="exclamation-triangle"]').exists()).toEqual(false)
  })

  it('should render exclamation icon when second feed has errors', () => {
    expect(createComponent().children().at(1).find('[type="exclamation-triangle"]').exists()).toEqual(true)
  })

  it('should pass prop "to" to link component', () => {
    const links = createComponent().find('Link')

    expect(links.at(0).prop('to')).toContainObject({query: {uuid: '1'}, route: ['admin', 'feed-detail']})
    expect(links.at(1).prop('to')).toContainObject({query: {uuid: '2'}, route: ['admin', 'feed-detail']})
  })
})
