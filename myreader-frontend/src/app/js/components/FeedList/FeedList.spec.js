import React from 'react'
import {mount} from 'enzyme'
import FeedList from './FeedList'
import {ADMIN_FEEDS_URL} from '../../constants'

/* eslint-disable react/prop-types */
jest.mock('../../contexts/locationState', () => ({
  withLocationState: Component => Component
}))
/* eslint-enable */

const headingClassName = '.my-feed-list__item-heading'

describe('FeedList', () => {

  let props

  const createWrapper = () => mount(<FeedList {...props} />)

  beforeEach(() => {
    props= {
      feeds: [
        {uuid: '1', title: 'title1', hasErrors: false, createdAt: '1'},
        {uuid: '2', title: 'title2', hasErrors: true, createdAt: '2'}
      ],
      searchParams: {
        q: undefined
      }
    }
  })

  it(' should return two feeds when query is undefined', () => {
    const headings = createWrapper().find(headingClassName).children()

    expect(headings.length).toEqual(2)
    expect(headings.at(0).prop('children')).toEqual('title1')
    expect(headings.at(1).prop('children')).toEqual('title2')
  })

  it('should return first feed matching query "title1"', () => {
    props.searchParams.q = 'title1'
    const headings = createWrapper().find(headingClassName).children()

    expect(headings.length).toEqual(1)
    expect(headings.at(0).prop('children')).toEqual('title1')
  })

  it('should return second feed matching query "title2"', () => {
    props.searchParams.q = 'title2'
    const headings = createWrapper().find(headingClassName).children()

    expect(headings.length).toEqual(1)
    expect(headings.at(0).prop('children')).toEqual('title2')
  })

  it('should return first feed matching query "TITLE1"', () => {
    props.searchParams.q = 'TITLE1'
    const headings = createWrapper().find(headingClassName).children()

    expect(headings.length).toEqual(1)
    expect(headings.at(0).prop('children')).toEqual('title1')
  })

  it('should return two feeds matching query "titl"', () => {
    props.searchParams.q = 'titl'
    const headings = createWrapper().find(headingClassName).children()

    expect(headings.length).toEqual(2)
    expect(headings.at(0).prop('children')).toEqual('title1')
    expect(headings.at(1).prop('children')).toEqual('title2')
  })

  it('should not render exclamation icon when first feed has no errors', () => {
    const items = createWrapper().find('.my-feed-list').children()

    expect(items.length).toEqual(2)
    expect(items.at(0).find('Icon').exists()).toEqual(false)
    expect(items.at(1).find('Icon').exists()).toEqual(true)
  })

  it('should pass prop "to" to link component', () => {
    const links = createWrapper().find('Link')

    expect(links.at(0).prop('to')).toEqual(`${ADMIN_FEEDS_URL}/1`)
    expect(links.at(1).prop('to')).toEqual(`${ADMIN_FEEDS_URL}/2`)
  })
})
