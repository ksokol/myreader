import React from 'react'
import {shallow} from 'enzyme'
import FeedList from './FeedList'
import {ADMIN_FEEDS_URL} from '../../constants'

describe('FeedList', () => {

  let props

  const createWrapper = () => shallow(<FeedList {...props} />)

  beforeEach(() => {
    props= {
      feeds: [
        {uuid: '1', title: '1', hasErrors: false, createdAt: '1'},
        {uuid: '2', title: '2', hasErrors: true, createdAt: '2'}
      ]
    }
  })

  it('should not render exclamation icon when first feed has no errors', () => {
    expect(createWrapper().children().at(0).find('[type="exclamation-triangle"]').exists()).toEqual(false)
  })

  it('should render exclamation icon when second feed has errors', () => {
    expect(createWrapper().children().at(1).find('[type="exclamation-triangle"]').exists()).toEqual(true)
  })

  it('should pass prop "to" to link component', () => {
    const links = createWrapper().find('Link')

    expect(links.at(0).prop('to')).toEqual(`${ADMIN_FEEDS_URL}/1`)
    expect(links.at(1).prop('to')).toEqual(`${ADMIN_FEEDS_URL}/2`)
  })
})
