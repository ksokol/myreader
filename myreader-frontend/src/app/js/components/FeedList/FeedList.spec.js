import React from 'react'
import {mount} from 'enzyme'
import {FeedList} from './FeedList'
import {ADMIN_FEEDS_URL} from '../../constants'
import {useSearchParams} from '../../hooks/useSearchParams'

/* eslint-disable react/prop-types */
jest.mock('../../hooks/useSearchParams', () => ({
  useSearchParams: jest.fn().mockReturnValue({})
}))
/* eslint-enable */

describe('FeedList', () => {

  let props

  const createWrapper = () => mount(<FeedList {...props} />)

  const findHeadings = () => createWrapper().find('Link').children()

  beforeEach(() => {
    props= {
      feeds: [
        {uuid: '1', title: 'title1', hasErrors: false, createdAt: '1'},
        {uuid: '2', title: 'title2', hasErrors: true, createdAt: '2'},
        {uuid: '3', title: 'other', hasErrors: true, createdAt: '3'},
      ]
    }
  })

  it(' should return three feeds when query is undefined', () => {
    const headings = findHeadings()

    expect(headings).toHaveLength(3)
    expect(headings.at(0).prop('children')).toEqual('title1')
    expect(headings.at(1).prop('children')).toEqual('title2')
    expect(headings.at(2).prop('children')).toEqual('other')
  })

  it('should return first feed matching query "title1"', () => {
    useSearchParams.mockReturnValueOnce({q: 'title1'})
    const headings = findHeadings()

    expect(headings).toHaveLength(1)
    expect(headings.at(0).prop('children')).toEqual('title1')
  })

  it('should return second feed matching query "title2"', () => {
    useSearchParams.mockReturnValueOnce({q: 'title2'})
    const headings = findHeadings()

    expect(headings).toHaveLength(1)
    expect(headings.at(0).prop('children')).toEqual('title2')
  })

  it('should return first feed matching query "TITLE1"', () => {
    useSearchParams.mockReturnValueOnce({q: 'TITLE1'})
    const headings = findHeadings()

    expect(headings).toHaveLength(1)
    expect(headings.at(0).prop('children')).toEqual('title1')
  })

  it('should return two feeds matching query "titl"', () => {
    useSearchParams.mockReturnValueOnce({q: 'titl'})
    const headings = findHeadings()

    expect(headings).toHaveLength(2)
    expect(headings.at(0).prop('children')).toEqual('title1')
    expect(headings.at(1).prop('children')).toEqual('title2')
  })

  it('should not render exclamation icon when first feed has no errors', () => {
    const items = createWrapper().find('.my-feed-list').children()

    expect(items).toHaveLength(3)
    expect(items.at(0).find('Icon').exists()).toEqual(false)
    expect(items.at(1).find('Icon').exists()).toEqual(true)
    expect(items.at(2).find('Icon').exists()).toEqual(true)
  })

  it('should pass prop "to" to link component', () => {
    const links = createWrapper().find('Link')

    expect(links.at(0).prop('to')).toEqual(`${ADMIN_FEEDS_URL}/1`)
    expect(links.at(1).prop('to')).toEqual(`${ADMIN_FEEDS_URL}/2`)
  })
})
